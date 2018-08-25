const fs      = require('fs');
const Discord = require('discord.js');
const config  = require('./config.js');
const logger  = require("./logger.js");

var options = new Object();

options.token = config.token;
options.totalShards = 'auto';

const manager = new Discord.ShardingManager('./bot.js', options);

manager.on('launch', shard => {
    logger.log("===== Launching shard " + shard.id);
});

console.log("== MAGIC 8 BOT ==");
console.log("booting up...");
logger.log("== SHARDING MANAGER ==");
logger.log("Spawning shard(s)");
manager.spawn();


// write stats every minute
setInterval(function () {
    getStats(0, 0);
}, 60000);

function getStats(index, guildCount) {

    var shardList = manager.shards.array();

    // if there are more shards to go
    if (index < shardList.length) {

        // get guildCount of that shard and recurse
        shardList[index].fetchClientValue('guilds.size').then(count => {
            guildCount += count;

            index++;
            getStats(index, guildCount);
        });
        return;
    } else {
        // if all shards have been searched

        // write current stats
        var fileName = './stats.json';
        var file = require(fileName);

        file.guildCount = guildCount;
        file.shards = shardList.length;

        fs.writeFile(
            fileName,
            JSON.stringify(file, null, 2),
            function (error) {
                if (error) return logger.log(null, error);
            }
        );
    }
}
