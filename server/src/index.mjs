import config from './config';
import app from './app';
import logger from './logger';
import './db';

app.listen(config.port);
logger.info(`APP STARTING AT PORT ${config.port}`);
