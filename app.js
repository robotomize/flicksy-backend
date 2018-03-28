import Koa from 'koa'
import koa2Validator from 'koa2-validator';
import views from 'koa-views'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import userAgent from 'koa2-useragent';
import api from './applications/api/index';
import site from './applications/site/index';
import Parser from './lib/parser';
import Streamer from './lib/tweet-streamer';
import Sentiments from './lib/store/sentiments';

const app = new Koa();

app.use(userAgent());
app.use(koa2Validator());

app.use(async (ctx, next) => {
    // console.log(await Sentiments.getTrends());
    await next();
});

app.use(serve(`${__dirname}/public`));
app.use(views(`./applications/site`, { extension: 'ejs' }));

app.use(bodyParser());

app.use(api.routes());
app.use(site.routes());

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

export default app
