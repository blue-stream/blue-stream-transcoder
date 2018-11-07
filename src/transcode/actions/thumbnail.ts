import { config } from '../../config';
import { Directory } from '../../utils/directory';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

export class Thumbnail {
    private static size: string = config.thumbnail.size;

    public static async create(dir: string, key: string) {
        const sourcePath = path.join(dir, key);
        await Thumbnail.process(
            sourcePath,
            Directory.changeFormat(key, 'png'),
            dir,
        );
    }

    private static process(sourcePath:string, imageName: string, destDir: string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .screenshots({
                timestamps: ['50%'],
                filename: imageName,
                folder: destDir,
                size: Thumbnail.size,
            })
            .on('end', function() {
                return resolv(imageName);
            })
            .on('error', function(err: Error) {
                return reject(err);
            })
        });
    }
}
