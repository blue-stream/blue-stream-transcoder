import { S3Bucket } from '../utils/s3Bucket';
import { Video } from './actions/video';
import { Thumbnail } from './actions/thumbnail';
import { Preview } from './actions/preview';
import { Directory } from '../utils/directory';

export class TranscodeManager {
    public static transcodeAndCreate(dir: string, key: string) {
        return Promise.all([
            Video.transcode(dir, key),
            Thumbnail.create(dir, key),
            Preview.create(dir, key),
        ]);
    }

    public static uploadTranscodedFiles(dir: string, key: string , bucket: S3Bucket) {
        return Promise.all([
            Directory.getFormat(key) === 'mp4' ?
            Promise.resolve() as Promise<any> :
            bucket.uploadFileFromDir(
                dir,
                Directory.changeFormat(key, 'mp4'),
            ),
            bucket.uploadFileFromDir(
                dir,
                Directory.changeFormat(key, 'png'),
            ),
            bucket.uploadFileFromDir(
                dir,
                Directory.changeFormat(key, 'gif'),
            ),
        ]);
    }

}
