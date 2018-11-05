import { S3Bucket } from '../utils/s3Bucket';
import * as master from 'video-master';

export class TranscodeManager {
    public static transcodeAndCreate(key: string) {
        return Promise.all([
            master.Video.transcode(key),
            master.Thumbnail.create(key),
            master.Preview.create(key),
        ]);
    }

    public static uploadTranscodedFiles(key: string, videosDirectory: any, bucket: S3Bucket) {
        return Promise.all([
            videosDirectory.getFormat(key) === 'mp4' ?
            Promise.resolve() as Promise<any> :
            bucket.uploadFileFromDir(
                videosDirectory.dir,
                videosDirectory.changeFormat(key, 'mp4'),
            ),
            bucket.uploadFileFromDir(
                videosDirectory.dir,
                videosDirectory.changeFormat(key, 'png'),
            ),
            bucket.uploadFileFromDir(
                videosDirectory.dir,
                videosDirectory.changeFormat(key, 'gif'),
            ),
        ]);
    }

}
