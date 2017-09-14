const Discord = require("discord.js");
const config  = require("./config.js");
const logger  = require("./logger.js");

const client = new Discord.Client();
const token = config.token;
const webhook_url = config.webhook_url;

client.login(token);

const responses = [
    "Without a doubt.",
    "It is certain.",
    "It is decidedly so.",
    "Yes, definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Signs point to yes.",
    "Ask again later.",
    "Reply hazy try again.",
    "Try again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
    "Yes.",
    "No.",
    "Yep.",
    "Nope.",
    "y35.",
    "n0.",
    "Only the prophecy will tell.",
    "Who cares? We all die in the end.",
    "Isn't it obvious?",
    "Obviously, yes.",
    "Yes, duh?",
    "I don't think so, no.",
    "Who gives a fuck?",
    "You wish.",
    "Is this a joke?",
    "Ask me if I care.",
    "Fuck do I know, I'm just a magic ball.",
    "No God, please, no.",
    "Just google it.",
    "Bitch, I don't know your life.",
    "Google might have the answer.",
    "Help! I'm trapped!",
    "Perhaps.",
    "Maybe, just maybe.",
    "You bet!",
    "Grow up and make your own decisions, idiot.",
    "Trust me, you don't want to know.",
    "No Ron.",
    "Ask Michael.",
    "Hell if I know.",
    "Barely possible.",
    "It's a secret to everybody.",
    "It depends.",
    "Don't take my word for it.",
    "Yeah, right.",
    "Sure, if you think so.",
    "In your dreams.",
    "Sounds good to me.",
    "Not yet.",
    "Probably.",
    "Very likely.",
    "Very unlikely.",
    "Not advisable.",
    "Give it time.",
    "When the planets align.",
    "You already know the answer to that.",
    "Maybe, in a few weeks, if you're lucky.",
    "Never in a million years, maybe in fewer.",
    "It smells like it.",
    "Possibly, but possibly it is impossible.",
    "They didn't allow me to tell you.",
    "No fucking way.",
    "Oh hell no!",
    "Kill them, kill all of them.",
    "Anything is possible.",
    "In theory, yes.",
    "I don't even know what to answer you.",
    "I don't know and I don't care.",
    "The answer is C.",
    "Ask me again tomorrow.",
    "I strongly believe so.",
    "It looks like it.",
    "I wouldn't worry about it."
];

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
        sendMsg(message.channel, "Ask me something, idiot.");
    }
    else if (content.length < 9 && !isQuestion){
        sendMsg(message.channel, "That's not a question.");
    }
    else if (content.length < 9 && isQuestion){
        sendMsg(message.channel, "Ok, now ask me a real question.");
    }
    else if (content.length >= 9 && !isQuestion){
        sendMsg(message.channel, "I only answer to proper grammar.");
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
    channel.send({embed});
}

function handleCommand(message, content){
    var argument = content.replace("--", "");

    if (argument == "help" || argument == "-h") {
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

function postWebHook(message, content){
    var hook_username = message.member.nickname == null ? message.author.username : message.member.nickname;
    /*WEBHOOK*/
    var options = {
        uri: webhook_url,
        method: 'POST',
        json: {
            "content": content,
            "username": hook_username,
            "avatar_url": message.author.avatarURL
        }
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
    });
}