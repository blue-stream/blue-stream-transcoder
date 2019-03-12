import * as winston from 'winston';
import * as os from 'os';
const Elasticsearch = require('winston-elasticsearch');
import { config } from '../config';

const indexTemplateMapping = require('winston-elasticsearch/index-template-mapping.json');
indexTemplateMapping.index_patterns = 'blue-stream-logs-*';

const logger = winston.createLogger({
    defaultMeta: { service: config.server.name, hostname: os.hostname() },
});

if (config.logger.elasticsearch.hosts) {
    const elasticsearch = new Elasticsearch({
        indexPrefix: 'blue-stream-logs',
        level: 'verbose',
        clientOps: config.logger.elasticsearch,
        bufferLimit: 100,
        ensureMappingTemplate: true,
        mappingTemplate: indexTemplateMapping,
    });
    logger.add(elasticsearch);
} else {
    const winstonConsole = new winston.transports.Console({
        level: 'silly',
    });
    logger.add(winstonConsole);
}

export default logger;
