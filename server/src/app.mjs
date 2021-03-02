import express from 'express';
import middlewares from './middlewares';
import router from './router';

const app = express();

app.use(middlewares.json);
app.use(middlewares.urlencoded);
app.use(middlewares.cors);
app.use(middlewares.multipart);
app.use('/api/v1', router);

export default app;
