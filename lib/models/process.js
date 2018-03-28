import mongoose from '../store/mongodb';

const Schema = mongoose.Schema;

const process = new Schema({
    movieName: String,
    movieId: String,
    movieIndex: String,
    medianData: Object,
    originData: Object,
    averages: Object,
    aggregateData: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.Promise = global.Promise;

export default mongoose.model('Process', process);