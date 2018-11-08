import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import * as rabbit from 'rabbit-lite';
import { Directory } from '../utils/directory';
import { config } from '../config';

export class TranscodeController {
    static bucket: S3Bucket | undefined = config.s3.enable ? new S3Bucket() : undefined;
    static videosDirectory = Directory.createDirectory(config.videosDirectory);

    static async transcode(originKey: string): Promise<void> {
        const videosDirectory = TranscodeController.videosDirectory;
        const bucket = TranscodeController.bucket;
        try {
            if (bucket) await bucket.downloadFileToDir(originKey, videosDirectory.dir);

            await videosDirectory.checkFileExist(originKey);

            await TranscodeManager.transcodeAndCreate(videosDirectory.dir, originKey);

            if (bucket) {
                await TranscodeManager.uploadTranscodedFiles(videosDirectory.dir, originKey, bucket);
                await bucket.delete(originKey);
            } else {
                if (!(Directory.getFormat(originKey) === 'mp4')) await videosDirectory.rm(originKey);
            }

        } finally {
            if (bucket) await videosDirectory.rmAnyFormat(originKey);
        }
    }

}
