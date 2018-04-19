const movie = require('../models/movie'),
    Movie = movie.model,
    redis = require('./redis');


class Movies {

    /**
     *
     * @returns {Promise}
     */
    static async findEnabledMovies(cache = false) {
        return new Promise(async (resolve, reject) => {
            const cacheKey = 'store:movies:find:enabled:movies';

            if (cache) {
                const cachedMovies = await redis.get(cacheKey);

                if (cachedMovies) {
                    resolve(JSON.parse(cachedMovies));
                }
            }

            Movie.find({status: movie.statuses.enabled}, async (err, movies) => {
                if (err) {
                    reject(err);
                }

                if (cache) {
                    await redis.set(cacheKey, JSON.stringify(movies), 'EX', 4 * 60 * 60 * 1000);
                }

                resolve(movies);
            });
        });
    };

    /**
     *
     * @param index
     * @param cache
     * @returns {Promise}
     */
    static async findByIndex(index, cache = false) {
        return new Promise(async (resolve, reject) => {
            const cacheKey = `store:movies:find:by:index:${index}`;

            if (cache) {
                const movie = await redis.get(cacheKey);

                if (movie) {
                    resolve(new Movie(JSON.parse(movie)));
                }
            }

            Movie.findOne({movieIndex: index}, async (err, movie) => {
                if (err) {
                    reject(err);
                }

                if (cache) {
                    await redis.set(cacheKey, JSON.stringify(movie), 'EX', 15 * 60 * 1000);
                }

                resolve(movie);
            });
        });
    };

    /**
     *
     * @returns {Promise}
     */
    static async findAll(cache = true) {
        return new Promise(async (resolve, reject) => {
            const cacheKey = 'store:movies:find:all';

            if (cache) {
                const cachedMovies = await redis.get(cacheKey);

                if (cachedMovies) {
                    resolve(JSON.parse(cachedMovies));
                }
            }

            Movie.find({}, async (err, movies) => {
                if (err) {
                    reject(err);
                }

                if (cache) {
                    await redis.set(cacheKey, JSON.stringify(movies), 'EX', 4 * 60 * 60 * 1000);
                }

                resolve(movies);
            });
        });
    };

    /**
     *
     * @returns {Promise}
     */
    static async disableMovies() {
        return new Promise(async (resolve, reject) => {
            Movie.update({}, {$set: {status: movie.statuses.disabled}}, { multi: true }, async (err) => {
                if (err) {
                    reject(err);
                    console.error(err);
                }
                resolve(true);
            });
        });
    }
}

module.exports = Movies;