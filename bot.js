const Discord = require("discord.js");
const config  = require("./config");
const logger  = require("./logger.js");
const request = require("request");
const fs      = require('fs');

const client = new Discord.Client();
const token = config.token;
const webhook_url = config.webhook_url;

const responses = require("./replies/responses.js");
const less_no   = require("./replies/less_no.js");
const less_yes  = require("./replies/less_yes.js");
const more_no   = require("./replies/more_no.js");
const none      = require("./replies/none.js");
const gay       = require("./replies/gay.js");
const why       = require("./replies/why.js");

client.login(token);

const INTERVAL = 30 * 60 * 1000;

setInterval(function() {
    let guilds = client.guilds.size;
    client.user.setPresence({ game: { name: "answers to " + guilds + " servers | 8ball help", type: 1, url: "https://www.twitch.tv/monstercat"}});
}, INTERVAL);

client.on('ready', () => {
    console.log("Ready!");
    setTimeout(function () {
        client.user.setStatus('online');
        client.user.setPresence({ game: { name: "answers | 8ball help", type: 1, url: "https://www.twitch.tv/monstercat"}});
    }, 10000);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.startsWith("8ball") || message.content.startsWith("<@357678717301948416>")){
        handleMessage(message);
    }
});

function handleMessage(message){

    var content;
    if (message.content.startsWith("<@357678717301948416>")) content = message.content.replace("<@357678717301948416>", "").trim();
    else if (message.content.startsWith("8ball")) content = message.content.replace("8ball", "").trim();

    if (content.length < 50){
        let cmd_arg = content.split(" ");
        var command = cmd_arg[0];
        var args = cmd_arg.slice(1);
    }

    if (command && fs.existsSync("./commands/" + command + ".js")) {
        try{
            let command_file = require("./commands/" + command);
            if (command_file.adminOnly && !isInWhitelist(message.author.id)) return message.channel.send("You are not allowed to do this.");
            command_file.run(message, args, client);
        }
        catch(err){
            console.error("== ERROR ON " + command + "\n" + err + "\n(STILL RUNNING) == \n");
        }
    }

    else {

        logger.log(">> " + content);
        postWebHook(message, ("8ball " + content));

        var isQuestion = content.indexOf("?") > 1;

        if (content == ""){
            sendMsg(message.channel, none[Math.floor(none.length * Math.random())]);
        }
        else if (content.toLowerCase().indexOf("why") > -1){
            sendMsg(message.channel, why[Math.floor(why.length * Math.random())]);
        }
        else if (content.length >= 9 && isQuestion && content.indexOf("gay") > -1){
            sendMsg(message.channel, gay[Math.floor(gay.length * Math.random())]);
        }
        else if (content.length < 9 && !isQuestion){
            sendMsg(message.channel, less_no[Math.floor(less_no.length * Math.random())]);
        }
        else if (content.length < 9 && isQuestion){
            sendMsg(message.channel, less_yes[Math.floor(less_yes.length * Math.random())]);
        }
        else if (content.length >= 9 && !isQuestion){
            sendMsg(message.channel, more_no[Math.floor(more_no.length * Math.random())]);
        }
        else{
            sendMsg(message.channel, responses[Math.floor(responses.length * Math.random())]);
        }
    }
}

function sendMsg(channel, text){
    var embed = {
        "description": text,
        "color": 65793
    };
    channel.send({embed}).then(msg => postWebHook(msg, text, true));
}

function isInWhitelist (userId){
    return (userId == config.owner1 || userId == config.owner2);
}

function postWebHook(message, content, is_myself){
    content = content.replace(/\@everyone/g, "everyone").replace(/\@here/g, "here");
    var hook_username = message.member.nickname == null ? message.author.username : message.member.nickname;
    var options;
    if (is_myself){
        options = {
            uri: webhook_url,
            method: 'POST',
            json: {
                "content": content,
                "username": hook_username
            }
        };
    } else{
        options = {
            uri: webhook_url,
            method: 'POST',
            json: {
                "content": content,
                "username": hook_username,
                "avatar_url": message.author.avatarURL
            }
        };
    }
    request(options, function (error, response, body) {
        if (error) console.log(error);
    });
}
