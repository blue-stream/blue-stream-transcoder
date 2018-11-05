import * as aws from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';

export class S3Bucket {
    s3: aws.S3;
    bucket: string;

    constructor() {
        this.s3 = new aws.S3({
            accessKeyId: config.s3.accessKeyId,
            region: config.s3.region,
            secretAccessKey: config.s3.secretAccessKey,
            signatureVersion: 'v3',
            s3ForcePathStyle: config.s3.isPathStyle,
            endpoint: config.s3.endpoint,
        });

        this.bucket = config.s3.bucket;
    }

    downloadFileToDir(key: string, destDir: string) {
        const fileStream = fs.createWriteStream(path.join(destDir, key));
        const params = { Bucket: this.bucket, Key: key };
        return this.s3.getObject(params).
        on('httpData', function (chunk: any) {
            fileStream.write(chunk);
        }).
        on('httpDone', function () {
            fileStream.end();
        }).promise();
    }

    uploadFileFromDir(srcDir: string, key: string) {
        const fileStream = fs.createReadStream(path.join(srcDir, key));
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: fileStream,
        };
        // Upload func use multi-part in parallel while putObject not. 
        // Notice that in order to upload to public bucket, you can't use multi-part
        return +(process.env.IS_PUBLIC_BUCKET || 0) === 1 ?
        this.s3.putObject(params).promise() :
        this.s3.upload(params).promise();
    }

    checkFileExist(key: string) {
        const params = { Bucket: this.bucket, Key: key };
        return this.s3.headObject(params).promise();
    }

    delete(key: string) {
        const params = { Bucket: this.bucket, Key: key };
        return this.s3.deleteObject(params).promise();
    }

}
