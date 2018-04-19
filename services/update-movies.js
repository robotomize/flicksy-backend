const Movies = require('../lib/store/movies'),
    Parser = require('../lib/parser'),
    movie = require('../lib/models/movie'),
    Movie = movie.model,
    Utils = require('../lib/utils/common'),
    movieStatuses = movie.statuses;

const main = async () => {
    console.log('Movie updater started');

    try {
        const parser = new Parser(),
            externalMovies = await parser.getMovies(false);
        let localMovies = await Movies.findEnabledMovies(false);
        console.log(externalMovies);
        disabledMovies(externalMovies, localMovies);
        localMovies = await Movies.findEnabledMovies(false);
        addMovies(externalMovies, localMovies);
    } catch (e) {
        console.error(e);
    }

    process.exit();
};

/**
 *
 * @param externalMovies
 * @param localMovies
 * @returns {Promise.<void>}
 */
const addMovies = async (externalMovies, localMovies) => {
    for (let localMovie of localMovies) {
        let findMovie = externalMovies.find(element => element.name === localMovie.name);
        if (findMovie === undefined || findMovie === null) {
            localMovie.status = movieStatuses.disabled;
            localMovie.markModified('status');
            await localMovie.save(err => {
                if (err) {
                    console.log(err);
                }
            }).catch(err => {
                console.log(err);
            });
            console.log(`Movie ${localMovie.name} is offline`);
        } else {
            console.log(`Movie ${localMovie.name} is exist`);
        }
    }
};

/**
 *
 * @param externalMovies
 * @param localMovies
 * @returns {Promise.<void>}
 */
const disabledMovies = async (externalMovies, localMovies) => {
    for (let externalMovie of externalMovies) {
        let findMovie = localMovies.find(element => element.name === externalMovie.name);
        if (findMovie === undefined || findMovie === null) {
            await new Movie({
                name: externalMovie.name,
                movieIndex: Utils.getMovieIndex(externalMovie.name, externalMovie.releaseDate),
                description: externalMovie.description,
                status: movieStatuses.enabled,
                genre: externalMovie.genre,
                releaseDate: externalMovie.releaseDate,
                poster: externalMovie.poster
            }).save().catch(err => {
                console.error(err);
            });
            console.log(`Movie ${externalMovie.name} is created`);
        }
    }
};

main();