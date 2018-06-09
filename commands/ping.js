module.exports = {
    adminOnly: false,
    run: ping
}

function ping(message, args, client) {
    message.channel.send('pinging...').then(msg => {
        msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms`);
    });
}
