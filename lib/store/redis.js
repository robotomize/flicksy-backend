import Redis from 'ioredis'

import {redisPort} from '../../configs/redis';
import {redisHost} from '../../configs/redis';

/**
 * @return Redis
 */
function redisInstance() {
    return new Redis(redisPort, redisHost);
}

const redis = redisInstance();

export {redisInstance};
export {redisPort};
export {redisHost};

export default redis;