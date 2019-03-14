import * as path from 'path';

export const config = {
    sampleVideosDirectory: path.join(process.cwd(), 'sample-videos'),
    videosDirectory: path.join(process.cwd(), 'videos'),
    logger: {
        elasticsearch: process.env.LOGGER_ELASTICSEARCH && {
            hosts: process.env.LOGGER_ELASTICSEARCH.split(','),
        },
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
    },
    server: {
        name: 'transcode',
    },
    s3: {
        enable: true,
        accessKeyId: process.env.S3_ACCESS_KEY_ID || 'AKIAINJAWB5EF2QRFR7Q',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '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',
        region: process.env.S3_REGION || 'us-east-1',
        bucket: process.env.S3_BUCKET || 'blue-stream-test',
        isPathStyle: (process.env.S3_IS_PATH_STYLE || '1') === '1' ? true : false,
        endpoint: process.env.S3_ENDPOINT || '',
        version: process.env.S3_VERSION || 'v4',
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
