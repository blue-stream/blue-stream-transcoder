import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import { config } from '../config';
import * as path from 'path';

export class TranscodeController {

    static async transcode(originKey: string): Promise<string[]> {
        const videosDirectory = config.videosDirectory;
        const bucket = config.s3.enable ? new S3Bucket() : undefined;
        const jobIndex = TranscodeManager.startJob(originKey);

        const wishedOriginPath = path.join(videosDirectory, originKey);
        
        try {
            const originPath = await TranscodeManager.assertVideo(wishedOriginPath, bucket);

            if (path.extname(originPath) === config.video.extention) {
                const productsPaths = await TranscodeManager.execActionsWithoutVideo(originPath);
                if (bucket)  {
                    const productsKeys = await TranscodeManager.uploadProducts(productsPaths, bucket);
                    productsKeys.push(originKey);
                    return productsKeys;
                }
                productsPaths.push(originPath);
                return productsPaths;
            } 

            const productsPaths = await TranscodeManager.execActions(originPath);

            if (bucket) {
                const productsKeys = await TranscodeManager.uploadProducts(productsPaths, bucket);
                await TranscodeManager.deleteOriginVideo(originPath, bucket);
                return productsKeys;
            }
            await TranscodeManager.deleteOriginVideo(originPath, bucket);
            return productsPaths;

        } finally {
            if (bucket) await TranscodeManager.deleteTempFiles(wishedOriginPath);
            TranscodeManager.finishJob(jobIndex);
        }
    }

}
