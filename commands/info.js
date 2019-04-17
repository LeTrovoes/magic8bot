module.exports = {
    adminOnly: false,
    run: about
};

function about(message, args, client) {
    const embed = {
        title: '**Info**',
        description: "It's a Magic 8-Ball, and it's a Bot. Pretty self-explanatory.",
        color: 65793,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
            text: 'Magic 8 Bot'
        },
        author: {
            name: 'Magic 8 Bot',
            icon_url: client.user.avatarURL
        },
        fields: [
            {
                name: 'Authors',
                value:
                    'Created by: **ArcAngela#2025** and **Thunder#5599**\nUsing: <:nodejs:336328404276346880> [Node.JS](https://nodejs.org) and [Eris](https://abal.moe/Eris/)'
            }
        ]
    };
    message.channel.createMessage({ embed });
}
