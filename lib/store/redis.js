const Redis = require('ioredis'),
    settings = require('../../configs/redis');

/**
 * @return Redis
 */
function redisInstance() {
    return new Redis(settings.conn.port, settings.conn.host);
}

const redis = redisInstance();

module.exports.redisInstance = redisInstance();
module.exports.redisPort = settings.conn.port;
module.exports.redisHost = settings.conn.host;
module.exports.redis = redis;