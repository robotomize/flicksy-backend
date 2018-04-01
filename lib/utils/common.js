import hash from 'object-hash';

export default class Utils {

    /**
     *
     * @param movie
     * @returns {string}
     */
    static transformMovieNameToStreamLike(movie = '') {
        return '#' + movie.replace(/\s/g, '')
    }

    /**
     *
     * @param str
     * @returns {*}
     */
    static generateHashTag(str) {
        if(!str || str.length === 0 || (str.replace(/([^a-zA-Z\s])/g, "").length + 1) > 140)
            return false;

        let finalString = '';
        str = str.replace(/([^a-zA-Z\s])/g, "").trim().toLowerCase().split(" ");

        for(let i in str)
            finalString += str[i].charAt(0).toUpperCase() + str[i].slice(1);

        return `#${finalString}`;
    }

    /**
     *
     * @param movieName
     * @param movieReleaseDate
     * @returns {*}
     */
    static getMovieIndex(movieName, movieReleaseDate) {
        if (movieName === undefined || !movieName || movieReleaseYear === undefined || !movieReleaseYear) {
            throw new Error('Empty input parameters');
        }

        const year = (new Date(Date.parse(movieReleaseDate))).getFullYear();

        if (isNaN(year)) {
            throw new Error(`movieReleaseDate argument ${movieReleaseDate} wrong date`);
        }

        return hash(`${movieName}:${movieReleaseYear}`);
    }
}