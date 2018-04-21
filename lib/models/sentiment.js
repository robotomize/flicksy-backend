const mongoose = require('../store/mongodb'),
    Mongoose = mongoose.Mongoose,
    Schema = Mongoose.Schema;


const sentiment = new Schema({
    movieName: String,
    movieIndex: String,
    tweetCreatedAt: String,
    name: String,
    screenName: String,
    profileImageUrl: String,
    text: String,
    status: {
        type: Number,
        default: statuses.saved
    },
    sentimentScore: Number,
    sentimentComparative: Number,
    source: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.Promise = global.Promise;

module.exports.statuses = {
    saved: 0,
    processed: 1
};

module.exports.model = Mongoose.model('SentimentData', sentiment);