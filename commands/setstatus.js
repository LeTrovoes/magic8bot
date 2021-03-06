module.exports = {
    adminOnly: true,
    run: setStatus
}

function setStatus(message, args, client){
    let status;

    if (['online', 'dnd', 'idle', 'invisible'].indexOf(args[0]) > -1) status = args[0];
    else status = 'online';

    client.shard.broadcastEval(`[this.user.setStatus('${status}')]`).then(results => {
        console.log("UPDATED STATUS: " + status);
    }).catch(console.error);
}
