import express from 'express';

import middlewares from './middlewares';
import { router, publicApiRouter } from './router';

const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.multipart);
app.use(middlewares.cookieParser);
app.use(middlewares.defaultHeaders);
app.use('/api/v1', router);
app.use('/public-api', publicApiRouter);

export default app;
