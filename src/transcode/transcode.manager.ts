import { S3Bucket } from '../utils/s3Bucket';
import { Video } from './actions/video';
import { Thumbnail } from './actions/thumbnail';
import { Preview } from './actions/preview';
import * as path from 'path';
import { config } from '../config';
import * as helpers from '../utils/helpers';
import * as del from 'del';


export class TranscodeManager {
    public static execActions(videoPath: string): Promise<string[]> {
        return Promise.all([
            Thumbnail.create(videoPath),
            Preview.create(videoPath),
            Video.transcode(videoPath),
        ]);
    }

    public static execActionsWithoutVideo(videoPath: string) {
        return Promise.all([
            Thumbnail.create(videoPath),
            Preview.create(videoPath),
        ]);
    }

    public static async assertVideo(videoPath: string, bucket?: S3Bucket) {
        if (bucket) await bucket.download(videoPath);

        const isExist = await helpers.isFileExist(videoPath);
        if (!isExist) throw new Error('File is not exist in the Videos directory');
        return videoPath;
    }

    public static async deleteOriginVideo(videoPath: string, bucket?: S3Bucket) {
        return (bucket ? bucket.delete(videoPath) : del(videoPath));
    }

    public static async deleteTempFiles(videoPath: string) {
        return del(helpers.changeExtention(videoPath, '.*'));
    }

    public static async uploadProducts(products: string[], bucket: S3Bucket) {
        return Promise.all(products.map(product => bucket.upload(product)));
    }

    public static async checkIfInProcess(videoPath: string, bucket?: S3Bucket) {
         const isExist = (await Promise.all([
            helpers.isFileExist(helpers.changeExtention(videoPath, '.png')),
            helpers.isFileExist(helpers.changeExtention(videoPath, '.gif')),
            bucket ? helpers.isFileExist(videoPath) : false,
         ])).indexOf(true);
         if(isExist == -1) return true;
         return new Error('The video already in process');
    }
}
