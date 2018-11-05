import { Request, Response } from 'express';
import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import * as master from 'video-master';

export class TranscodeController {
    static bucket: S3Bucket = new S3Bucket();
    static videosDirectory = master.getDirectory();

    static async transcode(key: string): Promise<void> {
        const videosDirectory = TranscodeController.videosDirectory;
        const bucket = TranscodeController.bucket;
        try {
            await bucket.downloadFileToDir(key, videosDirectory.dir);

            await videosDirectory.checkFileExist(key);

            await TranscodeManager.transcodeAndCreate(key);

            await TranscodeManager.uploadTranscodedFiles(key, videosDirectory, bucket);
        } finally {
            await videosDirectory.rmAnyFormat(key);
        }
    }

}
