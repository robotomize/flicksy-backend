import RankModel from '../models/rank';

export default class Ranks {
    /**
     *
     * @param movie
     * @returns {Promise}
     */
    static async findLastRankByMovie(movie) {
        return new Promise(async (resolve, reject) => {
            RankModel.findOne({movieIndex: movie.movieIndex}, {}, { sort: { 'createdAt' : -1 }}, (err, rank) => {
                if (err) {
                    reject(err);
                }

                resolve(rank);
            });
        });
    }

    /**
     *
     * @returns {Promise}
     */
    static async findAll() {
        return new Promise(async (resolve, reject) => {
            RankModel.find({}, {}, {}, (err, ranks) => {
                if (err) {
                    reject(err);
                }

                resolve(ranks);
            });
        });
    }
}