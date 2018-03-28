import mongoose from 'mongoose'
import connection from '../../configs/mongodb';
const dbName = 'flicksy';
const option = {
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

export default mongoose;