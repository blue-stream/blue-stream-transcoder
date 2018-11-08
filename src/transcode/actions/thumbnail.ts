import { config } from '../../config';
import * as helpers from '../../utils/helpers';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

export class Thumbnail {
    private static size: string = config.thumbnail.size;

    public static async create(videoPath: string): Promise<string> {
        return await Thumbnail.process(
            videoPath,
            helpers.changeExtention(path.basename(videoPath), '.png'),
            path.dirname(videoPath),
        );
    }

    private static process(sourcePath:string, thumbnailName: string, destDir: string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .screenshots({
                timestamps: ['50%'],
                filename: thumbnailName,
                folder: destDir,
                size: Thumbnail.size,
            })
            .on('end', function () {
                return resolv(path.join(destDir, thumbnailName));
            })
            .on('error', function (err: Error) {
                return reject(err);
            });
        });
    }
}
