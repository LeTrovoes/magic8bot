module.exports = {
    adminOnly: false,
    run: ping
};

function ping(message, args, client) {
    message.channel.createMessage('pinging...').then(msg => {
        msg.edit(`Pong! ${msg.timestamp - message.timestamp}ms`);
    });
}
