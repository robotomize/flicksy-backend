import Router from 'koa-router';
import Sentiments from '../../lib/store/sentiments';
import Sentiment from 'sentiment';
import Movies from '../../lib/store/movies';
import Ranks from '../../lib/store/ranks';

const router = new Router();

/**
 * Get movies
 */
router.get('/get/movies/', async ctx => {
    const movies = await Movies.findActiveMovies();
    ctx.body = JSON.stringify(movies.map(movie => {
        return {
            name: movie.name,
            movieIndex: movie.movieIndex,
            description: movie.description,
            status: movie.status,
            poster: movie.poster,
            releaseDate: movie.releaseDate,
            genre: movie.genre
        }
    }));
});

/**
 *  get data by movie
 */
router.get('/get/analytics/', async ctx => {
    const movieIndex = ctx.query.movie_index,
        movie = await Movies.findByIndex(movieIndex),
        rank = await Ranks.findLastRankByMovie(movie);

    ctx.body = await JSON.stringify(rank);
});

/**
 * Common statistic
 */
router.get('/get/stats/', async ctx => {
    const ranks = await Ranks.findAll();
    let statistic = {
        count: 0,
        negative: 0,
        positive: 0
    };

    for(let rank of ranks) {
        statistic.count += rank.count;
        statistic.negative += rank.negative;
        statistic.positive += rank.positive;
    }

    ctx.body = await JSON.stringify(statistic);
});

/**
 *  get random 5 tweets with emotionally
 */
router.get('/get/tweets/rand/', async ctx => {
    let sentiments = await Sentiments.findAll();
    const offset = 5;

    sentiments = sentiments.filter(sentiment => {
        return parseInt(Sentiment(sentiment.text).score) !== 0
    });

    const position = Math.floor(Math.random() * sentiments.length);

    ctx.body = JSON.stringify(sentiments.splice(position, position + offset));
});

/**
 * Get sorted top rated movies
 */
router.get('/get/top/', async ctx => {

});

/**
 * Get trends movie
 */
router.get('/get/trends/', async ctx => {


});

/**
 *  get analytic by movie
 */
router.get('/get/pulse/', async ctx => {

});

export default router