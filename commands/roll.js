module.exports = {
    adminOnly: false,
    run: roll
};

const responses = require('../replies/roll');

function roll(message, args, client) {
    sendMsg(message.channel, responses[Math.floor(responses.length * Math.random())]);
}

function sendMsg(channel, text) {
    var embed = {
        description: text,
        color: 65793
    };
    channel.createMessage({ embed });
}
