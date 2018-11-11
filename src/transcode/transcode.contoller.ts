import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import * as rabbit from 'rabbit-lite';
import { config } from '../config';
import * as path from 'path';
import * as del from 'del';
import * as helpers from '../utils/helpers';

export class TranscodeController {

    static async transcode(originKey: string): Promise<void> {
        const videosDirectory = config.videosDirectory;
        const bucket = config.s3.enable ? new S3Bucket() : undefined;
        const originPath = path.join(videosDirectory, originKey);
        try {
            if (bucket) await bucket.download(originKey, videosDirectory);

            await helpers.checkFileExist(originPath);

            const products: string[] = await TranscodeManager.execActions(originPath);

            if (bucket) await products.map(product => bucket.upload(product));

            if (!(path.extname(originKey) === config.video.extention)) {
                await (bucket ? bucket.delete(originKey) : del(originPath));
            }

        } finally {
            if (bucket) await del(helpers.changeExtention(originPath, '.*'));
        }
    }

}
