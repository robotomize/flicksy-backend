import Sentiment from 'sentiment';
import SentimentModel from './models/sentiment';
import SentimentRepository from './store/sentiments';
import Rating from './math';

export default class Analytic {

    /**
     *
     * @param movie
     * @param offset
     * @param count
     * @returns {Promise.<Array.<*>>}
     */
    static async getAnalyzedTweetsStream(movie, offset, count) {
        let sentiments = [];
        if (movie) {
            sentiments = await SentimentRepository.findByMovie(movie, -1);
        } else {
            sentiments = await SentimentRepository.findAll(movie, -1);
        }

        return count ? sentiments.filter(tweet => {
            return Sentiment(tweet.text).score !== 0;
        }).map(tweet => {
            tweet.reaction = Analytic.calculateTweetReaction(tweet.text);
            return tweet;
        }).slice(parseInt(offset) ? parseInt(offset) : 0, parseInt(offset) + parseInt(count)) : sentiments.filter(tweet => {
            return Sentiment(tweet.text).score !== 0;
        }).map(tweet => {
            tweet.reaction = Analytic.calculateTweetReaction(tweet.text);
            return tweet;
        });
    }

    /**
     *
     * @returns {Promise.<{status: number, positive: number, negative: number, count: number}>}
     */
    static async analyzeAll() {
        const sentiments = await Analytic.getAllData();
        return await Analytic.mapData(sentiments);
    }

    /**
     *
     * @returns {Promise.<{status: number, positive: number, negative: number, count: number}>}
     */
    static async analyzeNotProcessed() {
        const sentiments = await Analytic.getAllNotProcessedData();
        return await Analytic.mapData(sentiments);
    }

    /**
     *
     * @param movie
     * @returns {Promise.<{status: number, positive: number, negative: number, count: number}>}
     */
    static async analyzeByMovie(movie) {
        const sentiments = await Analytic.getDataByMovie(movie);
        return await Analytic.mapData(sentiments);
    }

    /**
     *
     * @param tweet
     * @returns {string}
     */
    static calculateTweetReaction(tweet) {
        return Rating.getStatusRank(Sentiment(tweet).score);
    }

    /**
     *
     * @param sentiment
     * @param object
     * @returns {*}
     */
    static calculate(sentiment, object) {
        if (sentiment.score) {
            if (sentiment.score > 0) {
                object.status += 1;
                object.positive += 1;
            } else if (sentiment.score < 0) {
                object.status -= 1;
                object.negative += 1;
            } else {

            }
        }

        object.count += 1;

        return object;
    }

    /**
     *
     * @returns {Promise.<{status: number, positive: number, negative: number, count: number}>}
     * @param sentiments
     */
    static async mapData(sentiments) {
        let analysedObject = Analytic.createAnalyticModel();
        await sentiments.forEach(element => {
            const sentimentObject = Sentiment(element);
            analysedObject = Analytic.calculate(sentimentObject, analysedObject);
            analysedObject = {
                status: analysedObject.status,
                emotionRank: Rating.getEmotionRank(
                    analysedObject.positive,
                    analysedObject.negative,
                    analysedObject.count),
                rank: Rating.getRankIndex(
                    analysedObject.positive,
                    analysedObject.negative),
                positive: analysedObject.positive,
                negative: analysedObject.negative,
                count: analysedObject.count,
            };
        });

        analysedObject.status = Rating.getStatusRank(analysedObject.status);

        return analysedObject;
    }

    /**
     *
     * @param movie
     * @returns {Promise.<void>}
     */
    static async getDataByMovie(movie) {
        const sentiments = await SentimentRepository.findByMovie(movie);
        return sentiments.map(sentiment => {
            return sentiment.text;
        })
    }

    /**
     *
     * @returns {Promise.<void>}
     */
    static async getAllData() {
        const sentiments = await SentimentRepository.findAll();
        return sentiments.map(sentiment => {
            return sentiment.text;
        })
    }

    /**
     *
     * @returns {Promise.<void>}
     */
    static async getAllNotProcessedData() {
        const sentiments = await SentimentRepository.findNotProcessed();
        return sentiments.map(sentiment => {
            return sentiment.text;
        })
    }

    /**
     *
     * @returns {{status: number, positive: number, negative: number, count: number}}
     */
    static createAnalyticModel() {
        return {
            status: 0,
            emotionRank: 0,
            rank: 0,
            positive: 0,
            negative: 0,
            count: 0,
        };
    }
}