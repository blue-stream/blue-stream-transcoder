 import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as del from 'del';
import { Command, stdType } from './command';

export function changeExtention(filePath: string, format: string): string {
    return filePath.replace(path.extname(filePath), format);
}

export async function isFileExist(filePath: string) {
    try {
        await util.promisify(fs.access)(filePath);
        return true;
    } catch {
        return false;
    }
}

export function createDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
