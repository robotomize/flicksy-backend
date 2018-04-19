require("isomorphic-fetch");

class Net {
    /**
     *
     * @param url
     * @param options
     * @returns {Promise}
     */
    static async request(url, options = { method: 'GET',
        mode: 'cors',
        cache: 'default',
        timeout: 5000,
        compress: true}) {

        return (new Promise(async (resolve, reject) => {
            fetch(url, options)
                .then(function(res) {
                    return res.text();
                }).then(function(body) {
                resolve(body);
            }).catch(err => {
                reject(err);
            });
        }));
    }
}

module.exports = Net;