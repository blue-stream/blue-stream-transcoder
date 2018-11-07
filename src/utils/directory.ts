 import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as del from 'del';
import { Command, stdType } from './command';

// Directory Object is Presentation of Unix Directory
export class Directory {

    private constructor(private _dir: string) {
    }

    public static createDirectory(dir: string): Directory {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return new Directory(dir);
    }

    get dir(): string {
        return this._dir;
    }

    public getFilePath(fileName: string): string {
        return path.join(this._dir, fileName);
    }

    public static changeFormat(fileName: string, format: string): string {
        return fileName.replace(path.extname(fileName), `.${format}`);
    }

    public static getFormat(fileName: string): string {
        return path.extname(fileName).slice(1);
    }

    public static getNameWithoutFormat(fileName: string): string {
        return fileName.split('.')[0];
    }

    public drop(): Promise<string[]> {
        return del(path.join(this._dir, '/*'));
    }

    public rm(fileName: string): Promise<string[]> {
        return del(path.join(this._dir, fileName));
    }

    public rmAnyFormat(fileName: string): Promise<string[]> {
        const pattern = path.join(this._dir, `${fileName.split('.')[0]}.*`);
        return del(path.join(this._dir, pattern));
    }

    public add(filePath: string): void {
        return fs.copyFileSync(filePath, this._dir);
    }

    public static checkPathExist(path: string) {
        return util.promisify(fs.access)(path);
    }

    public async checkFileExist(fileName: string) {
        return Directory.checkPathExist(this.getFilePath(fileName));
    }

}
