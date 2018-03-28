import mongoose from '../store/mongodb';

const Schema = mongoose.Schema;

const rank = new Schema({
    movieName: String,
    movieId: String,
    movieIndex: String,
    status: Number,
    emotionRank: Number,
    originRank: Number,
    medianRank: Number,
    positive: Number,
    negative: Number,
    count: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.Promise = global.Promise;

export default mongoose.model('Rank', rank);