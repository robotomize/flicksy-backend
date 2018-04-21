const movie = require('../models/movie'),
    Movie = movie.model;


class Movies {

    /**
     *
     * @returns {Promise}
     */
    static async findEnabledMovies() {
        return new Promise(async (resolve, reject) => {
            Movie.find({status: movie.statuses.enabled}, async (err, movies) => {
                if (err) {
                    reject(err);
                }

                resolve(movies);
            });
        });
    };

    /**
     *
     * @param index
     * @returns {Promise}
     */
    static async findByIndex(index) {
        return new Promise(async (resolve, reject) => {
            Movie.findOne({movieIndex: index}, async (err, movie) => {
                if (err) {
                    reject(err);
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
            Movie.find({}, async (err, movies) => {
                if (err) {
                    reject(err);
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