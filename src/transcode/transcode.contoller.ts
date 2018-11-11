import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import { config } from '../config';
import * as path from 'path';

export class TranscodeController {

    static async transcode(originKey: string): Promise<string[]> {
        const videosDirectory = config.videosDirectory;
        const bucket = config.s3.enable ? new S3Bucket() : undefined;
        const originPath = path.join(videosDirectory, originKey);
        let products: string[];
        try {
            await TranscodeManager.checkIfInProcess(originPath, bucket);
            await TranscodeManager.assertVideo(originPath, bucket);
            if (!(path.extname(originPath) === config.video.extention)) {
                products = await TranscodeManager.execActionsWithoutVideo(originPath);
                await TranscodeManager.deleteOriginVideo(originPath, bucket);
                if (bucket) products = await TranscodeManager.uploadProducts(products, bucket);
            } else {
                products = await TranscodeManager.execActions(originPath);
                if (bucket) products = await TranscodeManager.uploadProducts(products, bucket);
                products.push(originKey);
            }

            return products;
        } finally {
            if (bucket) await TranscodeManager.deleteTempFiles(originPath);
        }
    }

}
