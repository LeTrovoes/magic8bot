const fs = require('fs');
const Sharder = require('eris-sharder').Master;
const config = require('./config.js');

const sharder = new Sharder(config.token, '/bot.js', {
    stats: true,
    debug: true,
    clusters: config.clusters || 1,
    guildsPerShard: '1500',
    name: 'Magic8Bot',
    clientOptions: {
        messageLimit: 100,
        defaultImageFormat: 'png',
        disableEvents: { TYPING_START: true }
    }
});

sharder.on('stats', stats => {
    fs.writeFile('./stats.json', JSON.stringify(stats, null, 4) + '\n', function(error) {
        if (error) return console.error(error);
    });
});
