import mongoose from '../store/mongodb';

const Schema = mongoose.Schema;

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

export {statuses};
export default mongoose.model('Movie', movie);
