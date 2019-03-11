import * as rabbit from './utils/rabbit';
import { config } from './config';
import { TranscodeBroker } from './transcode/transcode.broker';
import * as helpers from './utils/helpers';
import logger from './utils/logger';

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err.stack);
    rabbit.closeConnection();
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection', err);
    rabbit.closeConnection();
    process.exit(1);
});

process.on('SIGINT', async () => {
    try {
        console.log('User Termination');
        rabbit.closeConnection();
        process.exit(0);
    } catch (error) {
        console.error('Faild to close connections', error);
    }
});

(async () => {
    await helpers.createDirectory(config.videosDirectory);
    await rabbit.connect();
    await TranscodeBroker.subscribe();
    console.log('Starting server');
    logger.verbose('Server Started: Rabbitmq connected')
})();
