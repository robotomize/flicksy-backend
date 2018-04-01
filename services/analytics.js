import Movies from '../lib/store/movies';
import Rating from '../lib/math';
import Sentiment from 'sentiment';
import SentimentModel, {sentimentStatuses} from '../lib/models/sentiment';
import RankModel from '../lib/models/rank';
import ProcessModel from '../lib/models/process';
import Processes from '../lib/store/processes';
import hash from 'object-hash';
import User from '../lib/models/user';
import Users from '../lib/store/users';
import Ranks from '../lib/store/ranks';

let processedCount = 0,
    moviesCount = 0;

/**
 *
 * @param movie
 */
const analyze = async movie => {
    let averages = {negative: {score: 0, count: 0}, positive: {score: 0, count: 0}},
        processModel = await Processes.findTailByMovie(movie);

    if (processModel) {
        averages = processModel.averages;
    }

    try {
        let i = 0;
        SentimentModel.find({status: 0, movieIndex: movie.movieIndex}).cursor().on('data', async (model) => {
            if (model.status === sentimentStatuses.saved || model.status === undefined) {
            let element = Sentiment(model.text);
            if (element.score !== undefined) {
                if (element.score > 0) {
                    averages.positive.count++;
                    averages.positive.score += element.score;
                }

                if (element.score < 0) {
                    averages.negative.count++;
                    averages.negative.score += element.score;
                }
            }
        }

        //addUser(model);

        if (i % 617 === 0) {
            console.log(averages);
        }
    }).on('error', err => {
            console.error(err);
    }).on('close', () => {
            // addProcessedCounter();
            // console.log(movie.name);
            // stop();
            let negativeMedian = Math.abs(averages.negative.score / averages.negative.count),
            positiveMedian = Math.abs(averages.positive.score / averages.positive.count),
            medians = {positive: positiveMedian, negative: negativeMedian};

        calculateRank(movie, medians, averages);
    });
    } catch (e) {
        console.error(e);
    }
};

/**
 *
 * @param movie
 * @param medians
 * @param averages
 */
const calculateRank = async (movie, medians, averages) => {
    let analysedObject = makeAnalyticModel();

    let processModel = await Processes.findTailByMovie(movie);

    if (processModel) {
        // originObject = processModel.originData;
        // medianObject = processModel.medianData;
        analysedObject = processModel.aggregateData;
    }

    let i = 0;
    SentimentModel.find({status: 0, movieIndex: movie.movieIndex}).cursor().on('data', async (model) => {
        if (model.status === sentimentStatuses.saved || model.status === undefined) {
        let sentimentObject = Sentiment(model.text);
        //medianObject = calculateMedianRank(sentimentObject, medianObject, medians);
        analysedObject = calculateOriginRank(sentimentObject,analysedObject);

        analysedObject = {
            status: analysedObject.status,
            emotionRank: Rating.getEmotionRank(analysedObject.positive, analysedObject.negative, analysedObject.count),
            // medianRank: Rating.getRankIndex(medianObject.positive, medianObject.negative),
            originRank: Rating.getRankIndex(analysedObject.positive, analysedObject.negative),
            positive: analysedObject.positive,
            negative: analysedObject.negative,
            count: analysedObject.count,
        };

        model.status = sentimentStatuses.processed;
        model.sentimentScore = sentimentObject.score;
        model.sentimentComparative = sentimentObject.comparative;
        model.source = 'twitter';
        model.markModified('status');
        await model.save().catch(err => {
            console.error(err);
    });
        if (processModel) {
            // processModel.medianData = medianObject;
            // processModel.originData = originObject;
            processModel.aggregateData = analysedObject;
            // model.markModified('medianData');
            // processModel.save().catch(err => {
            //     console.error(err);
            // });
            // model.markModified('originData');
            // processModel.save().catch(err => {
            //     console.error(err);
            // });
            processModel.markModified('aggregateData');
            await processModel.save().catch(err => {
                console.error(err);
        });
        } else {
            processModel = (new ProcessModel({
                movieName: movie.name,
                movieId: movie._id,
                movieIndex: movie.movieIndex,
                // medianData: medianObject,
                // originData: originObject,
                // averages: averages,
                aggregateData: analysedObject
            }));
            await processModel.save().catch(err => {
                console.error(err);
        });
        }

    }
    i++;
    if (i % 617 === 0) {
        console.log(analysedObject);
    }
}).on('error', err => {
        console.error(err);
}).on('close', async () => {
        const lastRank = await Ranks.findLastRankByMovie(movie);
    const updateRankModel = async () => {
        await (new RankModel({
            movieName: movie.name,
            movieId: movie._id,
            movieIndex: movie.movieIndex,
            status: analysedObject.status,
            emotionRank: analysedObject.emotionRank,
            originRank: analysedObject.originRank,
            medianRank: analysedObject.medianRank,
            positive: analysedObject.positive,
            negative: analysedObject.negative,
            count: analysedObject.count
        })).save().catch(err => {
            console.error(err);
    });
    };

    if (lastRank) {
        if (lastRank.count !== analysedObject.count) {
            await updateRankModel();
        }
    } else {
        await updateRankModel();
    }

    addProcessedCounter();
    console.log(movie.name, analysedObject);
    stop();
});
};

const main = async () => {
    try {
        const movies = await Movies.findActiveMovies();
        moviesCount = movies.length;
        for (let movie of movies) {
            calculateRank(movie);
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 *
 * @param sentiment
 * @param object
 * @param medians
 * @returns {*}
 */
const calculateMedianRank = (sentiment, object, medians) => {
    let coefficient = 0;

    if (sentiment.score) {
        if (sentiment.score > 0) {
            object.status += 1;
            if (sentiment.score > medians.positive) {
                coefficient += 1;
            }
            object.positive = (object.positive + 1) + coefficient;
        }
        if (sentiment.score < 0) {
            object.status -= 1;
            if (sentiment.score < medians.negative) {
                coefficient += 1;
            }
            object.negative = (object.negative + 1) + coefficient;
        }
    }

    object.count = (object.count + 1) + coefficient;

    return object;
};

/**
 *
 * @param sentiment
 * @param object
 * @returns {*}
 */
const calculateOriginRank = (sentiment, object) => {
    if (sentiment.score) {
        if (sentiment.score > 0) {
            object.status += 1;
            object.positive++;
        }
        if (sentiment.score < 0) {
            object.status -= 1;
            object.negative++;
        }
    }

    object.count++;

    return object;
};

const addProcessedCounter = () => {
    processedCount++;
};

/**
 *
 * @param model
 * @returns {Promise.<void>}
 */
const addUser = async (model) => {
    const user = await Users.findByUserName(model.screenName);

    if (!user) {
        if (model.screenName) {
            (new User({
                name: model.screenName,
                profileImageUrl: model.profileImageUrl
            })).save().catch(err => {
                console.error(err);
        });
        }
    }
};

/**
 *
 * @returns {{status: number, emotionRank: number, rank: number, positive: number, negative: number, count: number}}
 */
const makeAnalyticModel = () => {
    return {
        status: 0,
        emotionRank: 0,
        rank: 0,
        positive: 0,
        negative: 0,
        count: 0,
    };
};

const stop = () => {
    if (moviesCount === processedCount) {
        process.exit();
    }
};

main();