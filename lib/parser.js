const cheerio = require("cheerio"),
    Net = require('./utils/net'),
    redis = require('./store/redis');

class Parser {

    /**
     *
     * @returns {Promise.<Array>}
     */
    async getMovies(cache = false) {
        const cacheKey = 'parser:get:movies';

        if (cache) {
            const cachedMovies = await redis.get(cacheKey);
            if (cachedMovies) {
                return JSON.parse(cachedMovies);
            }
        }

        const urls = await this.getInTheaterMovies();
        let movies = [];

        for (let url of urls) {
            try {
                let movie = await this.getMovie(url);
                if (movie) {
                    movies.push({
                        name: movie.name,
                        description: movie.description,
                        poster: movie.poster,
                        releaseDate: movie.datePublished,
                        genre: movie.genre
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (cache) {
            await redis.set(cacheKey, JSON.stringify(movies), 'EX', 4 * 60 * 60 * 1000);
        }

        return movies;
    }

    /**
     *
     * @returns {Promise.<Array>}
     */
    async getInTheaterMovies() {
        try {
            const url = `${Parser.BASE_PATH}${Parser.PATH_IN_THEATERS}`;
            let html = '';

            try {
                html = await Net.request(url).catch(err => console.log(err));
            } catch (e) {
                console.error(e);

                return [];
            }

            const $ = cheerio.load(html);

            return JSON.parse($('script[type="application/ld+json"]').text())['itemListElement'].map(element => {
                return element['url'];
            });
        } catch (e) {
            console.error(e);

            return [];
        }
    }

    /**
     *
     * @returns {Promise.<Array>}
     */
    async getComingSoonMovies() {
        try {
            const url = `${Parser.BASE_PATH}${Parser.PATH_COMING_SOON}`;
            let html = '';

            try {
                html = await Net.request(url).catch(err => console.log(err));
            } catch (e) {
                console.error(e);

                return [];
            }

            const $ = cheerio.load(html);

            return JSON.parse($('script[type="application/ld+json"]').text())['itemListElement'].map(element => {
                return element['url'];
            });
        } catch (e) {
            console.error(e);

            return [];
        }
    }

    /**
     *
     * @param url
     * @returns {Promise.<null>}
     */
    async getMovie(url) {
        try {
            let html = '';

            try {
                html = await Net.request(url).catch(err => console.log(err));
            } catch (e) {
                console.error(e);

                return null;
            }

            const $ = cheerio.load(html);

            const movieObject = JSON.parse($('script[type="application/ld+json"]').text());
            movieObject.poster = $('meta[property="og:image"]').attr('content');
            return movieObject;
        } catch (e) {
            console.error(e);

            return null;
        }
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get BASE_PATH() {
        return 'http://www.metacritic.com';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get PATH_IN_THEATERS() {
        return '/browse/movies/release-date/theaters/date';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get PATH_COMING_SOON() {
        return '/browse/movies/release-date/coming-soon/date';
    }
}

module.exports = Parser;