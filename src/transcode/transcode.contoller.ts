import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import { config } from '../config';
import * as path from 'path';

export class TranscodeController {

    static async transcode(originKey: string): Promise<string[]> {
        const videosDirectory = config.videosDirectory;
        const bucket = config.s3.enable ? new S3Bucket() : undefined;
        const originPath = path.join(videosDirectory, originKey);
        try {
            await TranscodeManager.assertVideo(originPath, bucket);

            let products: string[] = await TranscodeManager.execActions(originPath);

            if (bucket) products = await TranscodeManager.uploadProducts(products, bucket);

            if (!(path.extname(originPath) === config.video.extention)) {
                await TranscodeManager.deleteOriginVideo(originPath, bucket);
            }
            return products;
        } finally {
            if (bucket) await TranscodeManager.deleteTempFiles(originPath);
        }
    }

}
