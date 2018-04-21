const Redis = require('ioredis'),
    settings = require('../../configs/redis');

/**
 * @return Redis
 */
function redisInstance() {
    return new Redis(settings.port, settings.host);
}

const redis = redisInstance();

module.exports.redisInstance = redisInstance();
module.exports.redisPort = settings.port;
module.exports.redisHost = settings.host;
module.exports.redis = redis;