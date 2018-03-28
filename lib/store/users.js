import User from '../models/user';
import redis from './redis';

export default class Users {
    /**
     *
     * @param name
     * @returns {Promise}
     */
    static async findByUserName(name) {
        return new Promise(async (resolve, reject) => {
            User.findOne({name: name}, {}, {}, (err, user) => {
                if (err) {
                    reject(err);
                }

                resolve(user);
            });
        });
    };
}