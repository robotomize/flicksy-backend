const mongoose = require('../store/mongodb'),
    Schema = mongoose.Schema;

const statuses = {
  enabled: 1,
  disabled: 0
};

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

module.exports.statuses = statuses;
module.exports.Movie = mongoose.model('Movie', movie);
