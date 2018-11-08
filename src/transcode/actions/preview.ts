import * as ffmpeg from 'fluent-ffmpeg';
import { config } from '../../config';
import * as helpers from '../../utils/helpers';
import { Command, stdType } from '../../utils/command';
import * as path from 'path';

export class Preview {
    private static size: string = config.preview.size;
    private static time: number = config.preview.time;
    private static offsetPercent: number = config.preview.offsetPercent;

    public static async create(videoPath: string): Promise<string> {
        const [sourcePath, destPath] = [
            videoPath,
            helpers.changeExtention(videoPath, '.gif'),
        ];
        const length = await Preview.getLength(sourcePath);
        const offset = Preview.getOffset(length);
        await Preview.process(sourcePath, destPath, offset);
        return destPath;
    }

    private static async getLength(sourcePath: string): Promise<number> {
        const output: string = await Command
        .execute(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${sourcePath}`);
        return +output;
    }

    private static getOffset(length: number) {
        return Math.ceil(length) * Preview.offsetPercent;
    }

    private static process(sourcePath: string, destPath: string, offset: number): Promise<string> {
        return Command
        .execute(`ffmpeg -i ${sourcePath} -ss ${offset} -t ${Preview.time} -vf scale=${Preview.size} -r 10 -f image2pipe -vcodec ppm - | convert -delay 5 -loop 0 - ${destPath}`);
    }
}
