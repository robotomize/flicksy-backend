import Movies from './lib/store/movies';
import Parser from './lib/parser';
import Movie from './lib/models/movie';
import {statuses} from "./lib/models/movie";
import hash from 'object-hash';

const main = async () => {
    console.log('Movie updater started');
    try {
        const parser = new Parser(),
            parsedMovies = await parser.getMovies(false),
            savedMovies = await Movies.findActiveMovies(false);
        console.log(parsedMovies);
        await Movies.offMovies();
        for (let movie of parsedMovies) {
            let findMovie = savedMovies.find(element => element.name === movie.name);
            if (findMovie === undefined) {
                findMovie = await Movies.findByIndex(hash(movie.name + ':' + movie.description));
                if (!findMovie) {
                    await new Movie({
                        name: movie.name,
                        movieIndex: hash(movie.name + ':' + movie.description),
                        description: movie.description,
                        status: statuses.active,
                        genre: movie.genre,
                        releaseDate: movie.releaseDate,
                        poster: movie.poster
                    }).save().catch(err => {
                        console.error(err);
                    });
                    console.log(`Movie ${movie.name} created`);
                } else {
                    findMovie.status = statuses.active;
                    findMovie.markModified('status');
                    await findMovie.save(err => {
                        if (err) {
                            console.log(err);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    console.log(`Movie ${movie.name} updated`);
                }
            } else {
                findMovie.status = statuses.active;
                findMovie.markModified('status');
                await findMovie.save(err => {
                    if (err) {
                        console.log(err);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit();
};

main();