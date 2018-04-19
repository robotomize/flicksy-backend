const mongoose = require('../store/mongodb'),
    Mongoose = mongoose.Mongoose,
    Schema = Mongoose.Schema;

const movie = new Schema({
    name: String,
    movieIndex: String,
    description: String,
    status: Number,
    genre: Array,
    releaseDate: String,
    poster: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.Promise = global.Promise;

module.exports.statuses = {
    enabled: 1,
    disabled: 0
};
module.exports.model = Mongoose.model('Movie', movie);
//module.exports = Mongoose.model('Movie', movie);
