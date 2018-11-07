import * as rabbit from 'rabbit-lite';
import { Logger } from './utils/logger';
import { config } from './config';
import { syslogSeverityLevels } from 'llamajs';
import { TranscodeBroker } from './transcode/transcode.broker';

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
    Logger.configure();
    Logger.log(syslogSeverityLevels.Informational, 'Server Started', `Port: ${config.server.port}`);
    rabbit.configure({
        username : config.rabbitMQ.username,
        password : config.rabbitMQ.password,
        port : config.rabbitMQ.port,
        host : config.rabbitMQ.host,
    });
    await rabbit.connect();
    await TranscodeBroker.assertExchanges();
    await TranscodeBroker.subscribe();
    console.log('Starting server');
})();
