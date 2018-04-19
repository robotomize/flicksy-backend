const mongoose = require('mongoose'),
    connection = require('../../configs/mongodb'),
    dbName = 'flicksy',
    option = {
        useMongoClient: true,
    };

mongoose.connect(`${connection.conn}${dbName}`, option);

module.exports.Schema = mongoose.Schema;
module.exports.Mongoose = mongoose;