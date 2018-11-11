import * as helpers from '../../utils/helpers';
import { config } from '../../config';
import { Video } from './video';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as del from 'del';

const videosDirectory = config.videosDirectory;
const sampleVideosDirectory = config.sampleVideosDirectory;
const flvSample = path.join(sampleVideosDirectory, 'flv.flv');
const mp4Sample = path.join(sampleVideosDirectory, 'mp4.mp4');
const mkvSample = path.join(sampleVideosDirectory, 'mkv.mkv');
const flv = path.join(videosDirectory, 'flv.flv');
const mp4 = path.join(videosDirectory, 'mp4.mp4');
const mkv = path.join(videosDirectory, 'mkv.mkv');

describe('Video action', () => {
    before(async () => {
        await helpers.createDirectory(config.videosDirectory);
    });

    after(async () => {
        await del(path.join(videosDirectory, '*'));
    });

    describe('#transcode()', () => {
        context('When video is flv format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(flvSample, flv);
            });

            it('should transcode video', async () => {
                const transcodedVideo = await Video.transcode(flv);
                expect(transcodedVideo).to.exist;
                expect(transcodedVideo).to.be.string;
                expect(path.isAbsolute(transcodedVideo)).to.be.true;
                expect(await helpers.isFileExist(transcodedVideo)).to.be.true;
            });
        });

        context('When video is mp4 format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(mp4Sample, mp4);
            });

            it('should transcode video', async () => {
                const transcodedVideo = await Video.transcode(mp4);
                expect(transcodedVideo).to.exist;
                expect(transcodedVideo).to.be.string;
                expect(path.isAbsolute(transcodedVideo)).to.be.true;
                expect(await helpers.isFileExist(transcodedVideo)).to.be.true;
            });
        });

        context('When video is mkv format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(mkvSample, mkv);
            });

            it('should transcode video', async () => {
                const transcodedVideo = await Video.transcode(mkv);
                expect(transcodedVideo).to.exist;
                expect(transcodedVideo).to.be.string;
                expect(path.isAbsolute(transcodedVideo)).to.be.true;
                expect(await helpers.isFileExist(transcodedVideo)).to.be.true;
            });
        });

        context('When video is not exist', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
            });

            it('should throw error when video is not exist', async () => {
                let hasThrown = false;
                try {
                    await Video.transcode(mkv);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });
});
