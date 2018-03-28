import SentimentData from '../models/sentiment';

export default class Sentiments {

    /**
     *
     * @param movie
     * @param sort
     * @returns {Promise}
     */
    static async findByMovie(movie, sort = 1) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({movieName: movie}, {}, { sort: { 'createdAt' : sort }}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    /**
     *
     * @param index
     * @returns {Promise}
     */
    static async findByMovieIndex(index) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({movieIndex: index}, {}, {}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    /**
     *
     * @param index
     * @param status
     * @returns {Promise}
     */
    static async findByMovieIndexStatus(index, status) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({movieIndex: index, status: status}, {}, {}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    /**
     *
     * @param name
     * @returns {Promise}
     */
    static async findByMovieName(name) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({movieName: name, status: status}, {}, {}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    /**
     *
     * @param name
     * @param status
     * @returns {Promise}
     */
    static async findByMovieNameStatus(name, status) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({movieName: name, status: status}, {}, {}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    /**
     *
     * @returns {Promise.<*>}
     */
    static async findAll(sort = 1) {
        return new Promise(async (resolve, reject) => {
            SentimentData.find({}, {}, { sort: { 'createdAt' : sort }}, (err, sentiments) => {
                if (err) {
                    reject(err);
                }

                resolve(sentiments);
            });
        });
    };

    // /**
    //  *
    //  * @returns {Promise}
    //  */
    // static async getTrends(movieNames) {
    //     return new Promise(async (resolve, reject) => {
    //         const aggregatorOpts = {
    //             $group: {
    //                 movie: "$movie_name",
    //                 count: {
    //                     $sum: 1
    //                 }
    //             }
    //         };
    //         SentimentData.aggregate(aggregatorOpts, (err, sentimentsGroup) => {
    //             if (err) {
    //                 reject(err);
    //             }
    //
    //             resolve(sentimentsGroup.filter(element => {
    //                 return movieNames.includes(element.movie);
    //             }).sort((a, b) => a.count > b.count).splice(0, 3));
    //         });
    //     });
    // }
}