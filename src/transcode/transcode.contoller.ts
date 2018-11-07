import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import * as rabbit from 'rabbit-lite';
import { Directory } from '../utils/directory';
import { config } from '../config';

export class TranscodeController {
    static bucket: S3Bucket = new S3Bucket();
    static videosDirectory = Directory.createDirectory(config.videosDirectory);

    static async transcode(key: string): Promise<void> {
        const videosDirectory = TranscodeController.videosDirectory;
        const bucket = TranscodeController.bucket;
        try {
            await bucket.downloadFileToDir(key, videosDirectory.dir);

            await videosDirectory.checkFileExist(key);

            await TranscodeManager.transcodeAndCreate(videosDirectory.dir, key);

            await TranscodeManager.uploadTranscodedFiles(videosDirectory.dir, key, bucket);

        } finally {
            await videosDirectory.rmAnyFormat(key);
        }
    }

}
