import Movies from '../lib/store/movies';
import streamer from '../lib/tweet-streamer';

const sourceStreamers = {
    tw: 'twitter',
    fb: 'facebook'
};
const main = async () => {
    try {
        const movies = await Movies.findEnabledMovies(false);
        let randIndex = Math.floor(Math.random() * (movies.length - 1)),
            stream = new streamer(movies[randIndex], sourceStreamers.tw);
        stream.create().catch((e) => {
            console.error(e);
        });
        setInterval(() => {
            stream.destroy();
            randIndex = Math.floor(Math.random() * (movies.length - 1));
            stream = new streamer(movies[randIndex], sourceStreamers.tw);
            stream.create().catch((e) => {
                console.error(e);
            });
        }, 1000 * 60 * 5);
    } catch (e) {
        console.error(e);
    }
};

main();