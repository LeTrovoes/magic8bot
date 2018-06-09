module.exports = {
    adminOnly: true,
    run: setGame
}

function setGame(message, args, client){
    let type = args[0];
    let game = args.slice(1).join(" ");
    let url, game_obj;

    if (!type || !game) game_obj = null;
    else{
        type = Number(type);
        if (type < 0 || type > 3 || isNaN(type)) type = 0;
        if (type == 1) url = 'https://www.twitch.tv/monstercat';

        game_obj = { name: game, type: type, url: url };
    }

    client.user.setPresence({game: game_obj});
}
