import { S3Bucket } from '../utils/s3Bucket';
import { Video } from './actions/video';
import { Thumbnail } from './actions/thumbnail';
import { Preview } from './actions/preview';
import * as path from 'path';
import { config } from '../config';

export class TranscodeManager {
    public static execActions(videoPath: string): Promise<string[]> {
        return Promise.all([
            path.extname(videoPath) === config.video.extention ? Video.transcode(videoPath) : '',
            Thumbnail.create(videoPath),
            Preview.create(videoPath),
        ]);
    }
}
