import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import { config } from '../config';
import * as path from 'path';

export class TranscodeController {
    private static inProcess:string[] = [];

    static async transcode(originKey: string): Promise<string[]> {
        const videosDirectory = config.videosDirectory;
        const bucket = config.s3.enable ? new S3Bucket() : undefined;
        const originPath = path.join(videosDirectory, originKey);
        let products: string[];

        const index = this.inProcess.indexOf(originKey);
        if (index < 0) this.inProcess.push(originKey);
        else throw new Error('the video is already in process');

        try {
            await TranscodeManager.assertVideo(originPath, bucket);

            if (path.extname(originPath) === config.video.extention) {
                products = await TranscodeManager.execActionsWithoutVideo(originPath);
                if (bucket) products = await TranscodeManager.uploadProducts(products, bucket);
                products.push(originKey);
            } else {
                products = await TranscodeManager.execActions(originPath);
                if (bucket) products = await TranscodeManager.uploadProducts(products, bucket);
                await TranscodeManager.deleteOriginVideo(originPath, bucket);
            }

            return products;
        } finally {
            if (bucket) await TranscodeManager.deleteTempFiles(originPath);
            this.inProcess.splice(index, 1);
        }
    }

}
