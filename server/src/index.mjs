import config from './config';
import app from './app';
import websockets from './websockets';
import logger from './logger';
import './db';

const server = app.listen(config.port);
logger.info(`APP STARTING AT PORT ${config.port}`);

websockets(server);
