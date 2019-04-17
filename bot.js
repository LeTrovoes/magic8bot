const Base = require('eris-sharder').Base;
const Eris = require('eris');
const config = require('./config');
const request = require('request');
const fs = require('fs');

// Settings
const token = config.token;
const webhook_url = config.webhook_url;
const INTERVAL = 10 * 60 * 1000; // update game every 10 minutes

// Responses
const responses = require('./replies/responses.js');
const less_no = require('./replies/less_no.js');
const less_yes = require('./replies/less_yes.js');
const more_no = require('./replies/more_no.js');
const none = require('./replies/none.js');
const gay = require('./replies/gay.js');
const why = require('./replies/why.js');

// Class to be exported to sharder
class Magic8Bot extends Base {
    constructor(bot) {
        super(bot);
    }

    launch() {
        // Set status on startup
        setTimeout(() => {
            this.bot.editStatus('online', {
                name: 'answers | 8ball help',
                type: 1,
                url: 'https://www.twitch.tv/monstercat'
            });
        }, 10000);

        // Update status every 10 minutes
        setInterval(this.updatePresence.bind(this), INTERVAL);

        // Handle messages
        this.bot.on('messageCreate', message => {
            if (message.author.bot) return;
            handleMessage(message, this.bot);
        });
    }

    updatePresence() {
        fs.readFile('./stats.json', 'utf8', (err, data) => {
            if (err) throw err;
            let stats = JSON.parse(data);
            this.bot.editStatus({
                name: 'answers to ' + stats.guilds + ' servers | 8ball help',
                type: 1,
                url: 'https://www.twitch.tv/monstercat'
            });
        });
    }
}

module.exports = Magic8Bot;

function handleMessage(message, client) {
    var content;
    if (message.content.startsWith('8ball')) {
        content = message.content.replace('8ball', '').trim();
    } else if (message.content.startsWith(`<@${client.user.id}>`)) {
        content = message.content.replace(`<@${client.user.id}>`, '').trim();
    } else if (message.content.startsWith(`<@!${client.user.id}>`)) {
        content = message.content.replace(`<@!${client.user.id}>`, '').trim();
    } else if (message.channel.type == 'dm') {
        content = message.content;
    } else return;

    if (content.length < 50) {
        let cmd_arg = content.split(' ');
        var command = cmd_arg[0];
        var args = cmd_arg.slice(1);
    }

    if (command && fs.existsSync('./commands/' + command + '.js')) {
        try {
            let command_file = require('./commands/' + command);
            if (command_file.adminOnly && !isInWhitelist(message.author.id))
                return message.channel.createMessage('You are not allowed to do this.');
            command_file.run(message, args, client);
        } catch (err) {
            console.error('== ERROR ON ' + command + '\n' + err + '\n(STILL RUNNING) == \n');
        }
    } else {
        console.log('>> ' + content);
        postWebHook(message, '8ball ' + content);

        var isQuestion = content.indexOf('?') > 1;

        if (content == '') {
            sendMsg(message.channel, none[Math.floor(none.length * Math.random())]);
        } else if (content.toLowerCase().indexOf('why') > -1) {
            sendMsg(message.channel, why[Math.floor(why.length * Math.random())]);
        } else if (content.length >= 9 && isQuestion && content.indexOf('gay') > -1) {
            sendMsg(message.channel, gay[Math.floor(gay.length * Math.random())]);
        } else if (content.length < 9 && !isQuestion) {
            sendMsg(message.channel, less_no[Math.floor(less_no.length * Math.random())]);
        } else if (content.length < 9 && isQuestion) {
            sendMsg(message.channel, less_yes[Math.floor(less_yes.length * Math.random())]);
        } else if (content.length >= 9 && !isQuestion) {
            sendMsg(message.channel, more_no[Math.floor(more_no.length * Math.random())]);
        } else {
            sendMsg(message.channel, responses[Math.floor(responses.length * Math.random())]);
        }
    }
}

function sendMsg(channel, text) {
    var embed = {
        description: text,
        color: 65793
    };
    channel.createMessage({ embed }).then(msg => postWebHook(msg, text, true));
}

function isInWhitelist(userId) {
    return userId == config.owner1 || userId == config.owner2;
}

function postWebHook(message, content, is_myself) {
    content = content.replace(/\@everyone/g, 'everyone').replace(/\@here/g, 'here');
    var hook_username =
        message.member == null || message.member.nick == null ? message.author.username : message.member.nick;
    var options;
    if (is_myself) {
        options = {
            uri: webhook_url,
            method: 'POST',
            json: {
                content: content,
                username: hook_username
            }
        };
    } else {
        options = {
            uri: webhook_url,
            method: 'POST',
            json: {
                content: content,
                username: hook_username,
                avatar_url: message.author.avatarURL
            }
        };
    }
    request(options, function(error, response, body) {
        if (error) console.log(error);
    });
}
