import * as path from 'path';

export const config = {
    sampleVideosDirectory: path.join(process.cwd(), 'sample-videos'),
    videosDirectory: path.join(process.cwd(), 'videos'),
    logger: {
        durable: false,
        exchangeType: process.env.RMQ_LOGGER_TYPE || 'topic',
        exchange: process.env.RMQ_LOGGER_EXCHANGE || 'blue_stream_logs',
        host: process.env.RMQ_LOGGER_HOST || 'localhost',
        port: +(process.env.RMQ_LOGGER_PORT || 15672),
        password: process.env.RMQ_LOGGER_PASS || 'guest',
        username: process.env.RMQ_LOGGER_USER || 'guest',
        persistent: false,
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
    },
    server: {
        port: 3000,
        name: 'transcode',
    },
    s3: {
        enable: true,
        accessKeyId: process.env.ACCESS_KEY_ID || 'AKIAINJAWB5EF2QRFR7Q',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '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',
        region: process.env.REGION || 'us-east-1',
        bucket: process.env.BUCKET || 'blue-stream-test',
        isPathStyle: process.env.IS_PATH_STYLE === '1' ? true : false,
        endpoint: process.env.ENDPOINT || '',
    },
    preview: {
        size: process.env.previewSize || '320x180',
        offsetPercent: +(process.env.previewOffsetPercent || 0.3),
        time: +(process.env.previewTime || 3),
    },
    thumbnail: {
        size: process.env.thumbnailSize || '320x180',
    },
    video: {
        videoCodec: process.env.videoCodec || 'libx264',
        audioCodec: process.env.audioCodec || 'aac',
        extention: process.env.format || '.mp4',
    },
};
