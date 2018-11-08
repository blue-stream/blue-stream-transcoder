import { config } from '../../config';
import { Directory } from '../../utils/directory';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

export class Video {
    private static audioCodec: string = config.video.audioCodec;
    private static videoCodec: string = config.video.videoCodec;
    private static format: string = config.video.format;

    public static async transcode(dir: string, key: string) {
        if (Directory.getFormat(key) === 'mp4') return;
        const sourcePath = path.join(dir, key);
        await Video.process(
            key,
            sourcePath,
            path.join(dir, Directory.changeFormat(key, this.format)),
        );
    }

    private static process(key:string, sourcePath:string, destPath:string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .audioCodec(this.audioCodec)
            .videoCodec(this.videoCodec)
            .format(this.format)
            .save(destPath)
            .on('end', function() {
                return resolv(key);
            })
            .on('error', function (err: Error) {
                // console.error(`ffmpeg error: ${err.message}`);
                return reject(err);
            });
        });
    }
}