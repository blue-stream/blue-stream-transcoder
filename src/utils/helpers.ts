 import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as del from 'del';
import { Command, stdType } from './command';

export function changeExtention(filePath: string, format: string): string {
    return filePath.replace(path.extname(filePath), format);
}

export function checkFileExist(filePath: string) {
    return util.promisify(fs.access)(filePath);
}

export function createDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
