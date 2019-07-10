import * as aws from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';

export class S3Bucket {
    s3: aws.S3;
    bucket: string;

    constructor() {
        const s3Config: any = {
            accessKeyId: config.s3.accessKeyId,
            region: config.s3.region,
            secretAccessKey: config.s3.secretAccessKey,
            signatureVersion: config.s3.version,
            s3ForcePathStyle: config.s3.isPathStyle,
        };
        if (config.s3.endpoint) s3Config.endpoint = config.s3.endpoint;
        this.s3 = new aws.S3(s3Config);

        this.bucket = config.s3.bucket;
    }
    createBucket () {
        return this.s3.createBucket({ Bucket: this.bucket }).promise()
        .catch((err: any) => {
            if (err.name !== 'BucketAlreadyOwnedByYou') {
                throw err;
            }
        });
    }

    async download(destPath: string) {
        const fileStream = fs.createWriteStream(destPath);
        const params = { Bucket: this.bucket, Key: path.basename(destPath) };
        await this.s3.getObject(params).
        on('httpData', function (chunk: any) {
            fileStream.write(chunk);
        }).
        on('httpDone', function () {
            fileStream.end();
        }).promise();
        return destPath;
    }

    async upload(srcPath: string) {
        const fileStream = fs.createReadStream(srcPath);
        const params = {
            Bucket: this.bucket,
            Key: path.basename(srcPath),
            Body: fileStream,
        };

        await this.s3.upload(params).promise();
        return path.basename(srcPath);
    }

    async isKeyExist(key: string) {
        const params = { Bucket: this.bucket, Key: key };
        try {
            await this.s3.headObject(params).promise();
            return true;
        } catch {
            return false;
        }
    }

    delete(key: string) {
        const params = { Bucket: this.bucket, Key: key };
        return this.s3.deleteObject(params).promise();
    }

}
