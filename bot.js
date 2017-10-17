const Discord = require("discord.js");
const config  = require("./config.js");
const logger  = require("./logger.js");
const request = require("request");

const client = new Discord.Client();
const token = config.token;
const webhook_url = config.webhook_url;

const responses = require("./replies/responses.js");
const less_no   = require("./replies/less_no.js");
const less_yes  = require("./replies/less_yes.js");
const more_no   = require("./replies/more_no.js");
const none      = require("./replies/none.js");
const gay       = require("./replies/gay.js");

client.login(token);

const minutes = 25, the_interval = minutes * 60 * 1000;
setInterval(function() {
    var guilds = client.guilds.size;
    client.user.setPresence({ game: { name: "the truth to " + guilds + " servers", type: 1, url: "https://www.twitch.tv/monstercat"}});
}, the_interval);

client.on('ready', () => {
    console.log("Ready!");
    setTimeout(function () {
        client.user.setStatus('online');
        client.user.setPresence({ game: { name: "the truth", type: 1, url: "https://www.twitch.tv/monstercat"}});
    }, 10000);
});

client.on('message', message => {
    if (message.content.startsWith("8ball") || message.content.startsWith("<@357678717301948416>")){
        handleMessage(message);
    }
});

function handleMessage(message){

    if(message.author.bot) return;

    var content;
    if (message.content.startsWith("<@357678717301948416>")) content = message.content.replace("<@357678717301948416>", "").trim();
    else if (message.content.startsWith("8ball")) content = message.content.replace("8ball", "").trim();

    logger.log(">> " + content);
    postWebHook(message, ("8ball " + content));

    var isQuestion = content.indexOf("?") > 1 ? true : false;

    if (content.indexOf("--") > -1){
        handleCommand(message, content);
    }
    else if (content == ""){
        sendMsg(message.channel, none[Math.floor(none.length * Math.random())]);
    }
    else if (content.indexOf("gay") > -1){
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

function sendMsg(channel, text){
    var embed = {
        "description": text,
        "color": 65793
    };
    channel.send({embed}).then(msg => postWebHook(msg, text, true));
}

function handleCommand(message, content){
    var argument = content.replace("--", "");

    if (argument == "help") {
        sendHelpMessage(message.channel);
    }else

    if (argument == "ping") {
        message.channel.send('pinging...')
        .then(msg => {
            msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
        });
    }else

    if (argument == "about" || argument == "info") {
        sendAboutMessage(message.channel);
    }else

    if (argument.startsWith("setgame") && isInWhitelist(message.author.id)){
        var game = argument.replace("setgame","").trim();
        if (game === "") game = null;
        /*let evaled = client.shard.broadcastEval(`[this.user.setPresence({ game: { name: "${game}", type: 0} })]`).then(results => {
            logger.log("Updated game");
        });*/
        client.user.setPresence({ game: { name: game, type: 0} });
        logger.log("Updated game");
    }else

     if (argument.startsWith("setstream") && isInWhitelist(message.author.id)){
        var game = argument.replace("setstream","").trim();
        if (game === "") game = null;
        /*let evaled = client.shard.broadcastEval(`[this.user.setPresence({ game: { name: "${game}", type: 1, url: "https://www.twitch.tv/monstercat"} })]`).then(results => {
            logger.log("Updated stream");
        });*/
        client.user.setPresence({ game: { name: game, type: 1, url: "https://www.twitch.tv/monstercat"}});
        logger.log("Updated stream");
    }else

    if (argument.startsWith("setstatus") && isInWhitelist(message.author.id)){
        var mystatus = argument.replace("setstatus","").trim();
        /*let evaled = client.shard.broadcastEval(`[this.user.setStatus('${mystatus}')]`).then(results => {
            logger.log("Updated status");
        });*/
        client.user.setStatus(mystatus);
        logger.log("Updated status");
    }

    else message.channel.send("Unknown command.");
}

function isInWhitelist (userId){
    return (userId == config.owner1 || userId == config.owner2);
}

function sendAboutMessage(channel){
    const embed = {
        "title": "**Info**",
        "description": "It's a Magic 8-Ball, and it's a Bot. Pretty self-explanatory.",
        "color": 65793,
        "timestamp": new Date(),
        "footer": {
            "icon_url": client.user.avatarURL,
            "text": "Magic 8 Bot"
        },
        "author": {
            "name": "Magic 8 Bot",
            "icon_url": client.user.avatarURL
        },
        "fields": [
        {
            "name": "Authors",
            "value": "Created by: **SintiePie#3744** and **Thunder#5599**\nUsing: <:nodejs:336328404276346880> [Node.JS](https://nodejs.org) and <:djs:348960148682964992> [Discord.JS](https://discord.js.org/#/)"
        }
        ]
    };
    channel.send({embed});
}

function sendHelpMessage(channel){
    const embed = {
        "title": "**Instructions**",
        "description": "Type **8ball** and ask me a question. Pretty simple, huh?\n\n",
        "url": "",
        "color": 65793,
        "timestamp": new Date(),
        "footer": {
            "icon_url": client.user.avatarURL,
            "text": "Magic 8 Bot"
        },
        "author": {
            "name": "Magic 8 Bot",
            "icon_url": client.user.avatarURL
        },
        "fields": [
            {
                "name": "Commands",
                "value": "```\n8ball --help    - Shows this message\n8ball --about   - About me\n8ball --ping    - Pong!```"
            },
            {
                "name": "Invite me to your server",
                "value": "[Click here](https://discordapp.com/oauth2/authorize?client_id=357678717301948416&scope=bot&permissions=104324161)"
            }
        ]
    };
    channel.send({embed});
}

function postWebHook(message, content, is_myself){
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