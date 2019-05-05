import * as path from 'path';

export const config = {
    sampleVideosDirectory: path.join(process.cwd(), 'sample-videos'),
    videosDirectory: path.join(process.cwd(), 'videos'),
    logger: {
        elasticsearch: process.env.LOGGER_ELASTICSEARCH && {
            hosts: process.env.LOGGER_ELASTICSEARCH.split(','),
        },
        indexPrefix: process.env.LOGGER_ELASTICSEARCH_PREFIX || 'blue-stream-logs',
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
        size: process.env.TCR_PREVIEW_SIZE || '320x180',
        offsetPercent: +(process.env.TCR_PREVIEW_OFFSET_PERCENT || 0.3),
        time: +(process.env.TCR_PREVIEW_TIME || 6),
    },
    thumbnail: {
        size: process.env.TCR_THUMBNAIL_SIZE || '320x180',
    },
    video: {
        videoCodec: process.env.TCR_VIDEO_CODEC || 'libx264',
        audioCodec: process.env.TCR_AUDIO_CODEC || 'aac',
        extention: process.env.TCR_VIDEO_FORMAT || '.mp4',
    },
    parallelTranscode: +(process.env.TCR_PARALLEL_TRANSCODE || 1),
};
