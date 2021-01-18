module.exports = {
    adminOnly: false,
    run: help
}

function help(message, args, client) {
    const embed = {
        "title": "**Instructions**",
        "description": "Type **8ball** and ask me a question. Pretty simple, huh?\n\nYou can also do that in DM\n(Thanks zixer321#6853 for this idea!)",
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
                "value": "```\n8ball roll - Rolls a dice\n8ball help - Shows this message\n8ball info - About me\n8ball ping - Pong!\n```"
            },
            {
                "name": "Invite me to your server",
                "value": "[Click here](https://discordapp.com/oauth2/authorize?client_id=357678717301948416&scope=bot&permissions=3072)"
            }
        ]
    };
    message.channel.send({embed});
}
