import { config } from '../../config';
import * as helpers from '../../utils/helpers';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

export class Video {
    private static readonly audioCodec: string = config.video.audioCodec;
    private static readonly videoCodec: string = config.video.videoCodec;
    private static readonly format: string = config.video.extention;

    public static async transcode(videoPath: string) : Promise<string> {
        return await Video.process(
            videoPath,
            helpers.changeExtention(videoPath, this.format),
        );
    }

    private static process(sourcePath:string, destPath:string) {
        return new Promise<string>((resolv, reject) => {
            ffmpeg(sourcePath)
            .audioCodec(this.audioCodec)
            .videoCodec(this.videoCodec)
            .format(this.format.slice(1))
            .save(destPath)
            .on('end', function () {
                return resolv(destPath);
            })
            .on('error', function (err: Error) {
                // console.error(`ffmpeg error: ${err.message}`);
                return reject(err);
            });
        });
    }
}
