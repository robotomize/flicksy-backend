import mongoose from '../store/mongodb';

const Schema = mongoose.Schema;
const statuses = {
    saved: 0,
    processed: 1
};

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

export {statuses as sentimentStatuses};
export default mongoose.model('SentimentData', sentiment);