import * as helpers from '../utils/helpers';
import { config } from '../config';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as del from 'del';
import { S3Bucket } from '../utils/s3Bucket';
import { TranscodeController } from './transcode.contoller';

const videosDirectory = config.videosDirectory;
const sampleVideosDirectory = config.sampleVideosDirectory;
const flv = 'flv.flv';
const mp4 = 'mp4.mp4';
const mkv = 'mkv.mkv';
const unknown = 'unknown.mp4';
const flvSamplePath = path.join(sampleVideosDirectory, flv);
const mp4SamplePath = path.join(sampleVideosDirectory, mp4);
const mkvSamplePath = path.join(sampleVideosDirectory, mkv);
const flvPath = path.join(videosDirectory, flv);
const mp4Path = path.join(videosDirectory, mp4);
const mkvPath = path.join(videosDirectory, mkv);
const bucket = new S3Bucket();

describe('Transcode Controller', () => {
    before(async () => {
        await helpers.createDirectory(config.videosDirectory);
        await bucket.createBucket();
    });

    after(async () => {
        await del(path.join(videosDirectory, '*'));
    });

    describe('#transcode() when use Bucket', () => {
        context('When video is flv format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                await bucket.upload(flvSamplePath);
                expect(await bucket.isKeyExist(flv)).to.be.true;
            });

            it('should transcode and delete temp files and origin video', async () => {
                const products: string[] = await TranscodeController.transcode(flv);

                expect(products).to.be.an('array');
                expect(products).to.deep.equal([
                    helpers.changeExtention(flv, '.png'),
                    helpers.changeExtention(flv, '.gif'),
                    helpers.changeExtention(flv, config.video.extention),
                ]);

                const productsExistInBucket = await Promise.all(products.map(product => bucket.isKeyExist(product)));
                expect(productsExistInBucket).to.be.an('array');
                expect(productsExistInBucket).to.deep.equal([true, true, true]);

                const productsExistInDir = await Promise.all(products.map(product => helpers.isFileExist(path.join(videosDirectory, product))));
                expect(productsExistInDir).to.be.an('array');
                expect(productsExistInDir).to.deep.equal([false, false, false]);

                const isOriginVideoExist = await helpers.isFileExist(flvPath);
                expect(isOriginVideoExist).to.be.false;
            });
        });

        context('When video is mp4 format', () => {
            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                await bucket.upload(mp4SamplePath);
                expect(await bucket.isKeyExist(mp4)).to.be.true;
            });

            it('should transcode and delete temp files and origin video', async () => {
                const products: string[] = await TranscodeController.transcode(mp4);

                expect(products).to.be.an('array');
                expect(products).to.deep.equal([
                    helpers.changeExtention(mp4, '.png'),
                    helpers.changeExtention(mp4, '.gif'),
                    helpers.changeExtention(mp4, config.video.extention),
                ]);

                const productsExistInBucket = await Promise.all(products.map(product => bucket.isKeyExist(product)));
                expect(productsExistInBucket).to.be.an('array');
                expect(productsExistInBucket).to.deep.equal([true, true, true]);

                const productsExistInDir = await Promise.all(products.map(product => helpers.isFileExist(path.join(videosDirectory, product))));
                expect(productsExistInDir).to.be.an('array');
                expect(productsExistInDir).to.deep.equal([false, false, false]);

                const isOriginVideoExist = await helpers.isFileExist(mp4Path);
                expect(isOriginVideoExist).to.be.false;
            });

        });

        context('When video is not exist', () => {
            it('should throw error when video not found', async () => {
                let errorThrown = false;
                try {
                    const products: string[] = await TranscodeController.transcode(unknown);
                } catch (error) {
                    errorThrown = true;
                } finally {
                    expect(errorThrown).to.be.true;
                }

            });

        });
    });
});
