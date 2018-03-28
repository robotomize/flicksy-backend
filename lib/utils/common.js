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
    static generateHashTag (str) {
        if(!str || str.length === 0 || (str.replace(/([^a-zA-Z\s])/g, "").length + 1) > 140)
            return false;

        let finalString = '';
        str = str.replace(/([^a-zA-Z\s])/g, "").trim().toLowerCase().split(" ");

        for(let i in str)
            finalString += str[i].charAt(0).toUpperCase() + str[i].slice(1);

        return `#${finalString}`;
    }
}