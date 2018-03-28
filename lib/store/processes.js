import redis from './redis';
import Process from '../models/process';

export default class Processes {
    /**
     *
     * @param movie
     * @returns {Promise}
     */
    static async findTailByMovie(movie) {
        return new Promise(async (resolve, reject) => {
            Process.findOne({movieIndex: movie.movieIndex}, {}, { sort: { 'createdAt' : -1 }}, (err, process) => {
                if (err) {
                    reject(err);
                }

                resolve(process);
            });
        });
    };
}