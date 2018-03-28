require('babel-core/register');
const Parser = require('./lib/parser');

const run = async () => {
    const parser = new Parser();
    const movies = await parser.getMovies();
    console.log(movies);
};
run();
