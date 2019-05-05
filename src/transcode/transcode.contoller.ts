import { TranscodeManager } from './transcode.manager';
import { S3Bucket } from '../utils/s3Bucket';
import { config } from '../config';
import * as path from 'path';
import { log } from '../utils/logger';

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
                // await TranscodeManager.deleteOriginVideo(originKey, bucket);
                log('info' , 'File transcoded', `file with key ${originKey} was transcoded`, '', 'unknown');
                return productsKeys;
            }
            // await TranscodeManager.deleteOriginVideo(originPath, bucket);
            log('info' , 'File transcoded', `file with key ${originKey} was transcoded`, '', 'unknown');
            return productsPaths;

        }
        catch(error) {
            log('warn' , 'File transode failure', `file with key ${originKey} failed transcoding with error: ${error}`, '', 'unknown');
            throw error;
        } finally {
            if (bucket) {
                try {
                    await TranscodeManager.deleteTempFiles(wishedOriginPath);
                    log('verbose' , 'Delete temp files', `delete temp files of ${originKey}`, '', 'unknown');
                } catch(error) {
                    log('error' , 'Delete temp files failure', `delete temp files of ${originKey} failed with error: ${error}`, '', 'unknown');
                }
            }
            TranscodeManager.finishJob(jobIndex);
        }
    }

}
