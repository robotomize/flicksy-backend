import TwitterConfig from '../configs/twitter-auth';
import Twitter from 'twit';
import SentimentData from './models/sentiment';
import Tokenizer from 'remove-words';
import Combinatorics from 'js-combinatorics';
import Utils from '../lib/utils/common';

export default class TweetStream {

    /**
     *
     * @param movie
     * @param source
     */
    constructor(movie, source) {
        this.movie = movie;
        this.source = source;

        try {
            this.client = new Twitter(TwitterConfig.alexandra);
            this.stream = this.client.stream('statuses/filter', {
                track: TweetStream.createTracks(this.movie.name),
                language: 'en'
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @returns {Promise.<void>}
     */
    async create() {
        console.log(`Stream ${this.movie.name} started`);
        try {
            this.stream.on('tweet', event => {
                if (event && event.text) {
                    new SentimentData({
                        movieName: this.movie.name,
                        movieIndex: Utils.getMovieIndex(this.movie.name, this.movie.releaseDate),
                        tweetCreatedAt: event.created_at,
                        name: event.user.name,
                        screenName: event.user.screen_name,
                        profileImageUrl: event.user.profile_image_url,
                        status: 0,
                        source: this.source,
                        text: event.text
                    }).save(err => {
                        if (err) {
                            console.error(err);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    console.log(this.movie.name, event.text);
                }
            });
            this.stream.on('error', err => {
               console.error(err);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @returns {Promise.<void>}
     */
    async destroy() {
        try {
            this.stream.stop();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param movieName
     * @returns {Array}
     */
    static createTracks(movieName) {
        const tokens = Tokenizer(movieName);
        let tracks = TweetStream.getTracks(tokens, movieName);

        return tracks.push(movieName);
    }

    /**
     *
     * @param tokens {Array}
     * @param name
     * @returns {Array}
     */
    static getTracks(tokens, name) {
        if (tokens.length <= 1) {
            return [TweetStream.generateHashTag(name) + 'Movie'];
        }

        let tracks = [];

        if (tokens.length >= 3) {
            tracks = tracks.concat(Combinatorics.combination(tokens, 2).toArray().map(pair => pair.join(' ')));
        }

        return tokens[tokens.length - 1].trim().toLowerCase() === 'movie' ?
            TweetStream.generateMovieHashTag(tracks, tokens.slice(0, tokens.length - 1)) :
            TweetStream.generateMovieHashTag(tracks, tokens);
    }

    /**
     *
     * @param tracks
     * @param tokens
     * @returns {*}
     */
    static generateMovieHashTag(tracks, tokens) {
        tracks.push(TweetStream.generateHashTag(tokens.join(" ")));
        tracks.push(TweetStream.generateHashTag(tokens.join(" ")) + 'Movie');

        return tracks;
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

        for (let i in str) {
            finalString += str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }

        return `#${finalString}`;
    }
}