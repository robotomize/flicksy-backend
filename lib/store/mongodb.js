const mongoose = require('mongoose'),
    connection = require('../../configs/mongodb'),
    dbName = 'flicksy',
    option = {
    server: {
        socketOptions: {
            keepAlive: 5000000,
            connectTimeoutMS: 500000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 5000000,
            connectTimeoutMS: 500000
        }
    }
};

mongoose.connect(`${connection}${dbName}`, option);

module.exports.mongoose = mongoose;