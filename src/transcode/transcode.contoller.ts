import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import * as rabbit from 'rabbit-lite';
import { config } from '../config';
import * as path from 'path';
import * as del from 'del';
import * as helpers from '../utils/helpers';

export class TranscodeController {
    static bucket: S3Bucket | undefined = config.s3.enable ? new S3Bucket() : undefined;

    static async transcode(originKey: string): Promise<void> {
        const videosDirectory = config.videosDirectory;
        const bucket = TranscodeController.bucket;
        const originPath = path.join(videosDirectory, originKey);
        try {
            if (bucket) await bucket.download(originKey, videosDirectory);

            await helpers.checkFileExist(originPath);

            const products: string[] = await TranscodeManager.execActions(originPath);

            if (bucket) {
                await products.map(product => bucket.upload(product));
                await bucket.delete(originKey);
            } else {
                if (!(path.extname(originKey) === config.video.extention)) await del(originPath);
            }

        } finally {
            if (bucket) await del(helpers.changeExtention(originPath, '.*'));
        }
    }

}
