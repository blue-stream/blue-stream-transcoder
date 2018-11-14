import * as rabbit from './utils/rabbit';
import { Logger } from './utils/logger';
import { config } from './config';
import { syslogSeverityLevels } from 'llamajs';
import { TranscodeBroker } from './transcode/transcode.broker';
import * as helpers from './utils/helpers';

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
    Logger.configure();
    await rabbit.connect();
    await TranscodeBroker.subscribe();
    console.log('Starting server');
    Logger.log(syslogSeverityLevels.Informational, 'Server Started', 'Rabbitmq connected');
})();
