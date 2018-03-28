import wilson from 'wilson-interval-func';

export default class Rating {

    /**
     *
     * Calculate rank with Wilson interval
     *
     * @param positive
     * @param negative
     * @returns {number}
     */
    static getRankIndex(positive, negative) {
        return Math.round(wilson.calc(positive, (positive + negative)) * 100);
    }

    /**
     *
     * @param positive
     * @param negative
     * @param count
     * @returns {number}
     */
    static getEmotionRank(positive, negative, count) {
        positive = isNaN(parseInt(positive)) ? 0 : parseInt(positive);
        negative = isNaN(parseInt(negative)) ? 0 : parseInt(negative);
        count = isNaN(parseInt(count)) ? 0 : parseInt(count);

        return Math.round(wilson.calc(positive + negative, count) * 100);
    }

    /**
     *
     * @param status
     * @returns {string}
     */
    static getStatusRank(status) {
        let message = Rating.STATUS_NO_ENOUGH_DATA;
        status = parseInt(status);

        if (isNaN(status) || status === Rating.STATUS_BREAK_POINT_NEUTRAL) {
            message = Rating.STATUS_NO_ENOUGH_DATA;
        } else if (status > Rating.STATUS_BREAK_POINT_POSITIVE) {
            message = Rating.STATUS_GREAT;
        } else if (status > -1 * Rating.STATUS_BREAK_POINT_FINE && status < Rating.STATUS_BREAK_POINT_FINE) {
            message = Rating.STATUS_FINE;
        } else if (status > Rating.STATUS_BREAK_POINT_NEUTRAL && status < Rating.STATUS_BREAK_POINT_POSITIVE) {
            message = Rating.STATUS_AWESOME;
        } else if (status < Rating.STATUS_BREAK_POINT_NEGATIVE) {
            message = Rating.STATUS_AWFUL;
        } else if (status < Rating.STATUS_BREAK_POINT_NEUTRAL && status > Rating.STATUS_BREAK_POINT_NEGATIVE) {
            message = Rating.STATUS_BAD;
        } else {

        }

        return message;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_FINE() {
        return 'Fine';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_GREAT() {
        return 'Great!'
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_AWESOME() {
        return 'Awesome!';
    }


    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_AWFUL() {
        return 'Awful!';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_BAD() {
        return 'Bad!';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get STATUS_NO_ENOUGH_DATA() {
        return 'Not enough data to rate.';
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get STATUS_BREAK_POINT_NEUTRAL() {
        return 0;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get STATUS_BREAK_POINT_FINE() {
        return 2;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get STATUS_BREAK_POINT_POSITIVE() {
        return 5;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get STATUS_BREAK_POINT_NEGATIVE() {
        return -5;
    }

}