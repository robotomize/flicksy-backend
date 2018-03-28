import mongoose from '../store/mongodb';

const Schema = mongoose.Schema;


const user = new Schema({
    name: String,
    profileImageUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.Promise = global.Promise;

export default mongoose.model('User', user);