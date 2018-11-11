import * as helpers from '../../utils/helpers';
import { config } from '../../config';
import { Preview } from './preview';
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

describe('Preview action', () => {
    before(async () => {
        await helpers.createDirectory(config.videosDirectory);
    });

    after(async () => {
        await del(path.join(videosDirectory, '*'));
    });

    describe('#create()', () => {
        context('When video is flv format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(flvSample, flv);
            });

            it('should create preview', async () => {
                const createdPreview = await Preview.create(flv);
                expect(createdPreview).to.exist;
                expect(createdPreview).to.be.string;
                expect(path.isAbsolute(createdPreview)).to.be.true;
                expect(await helpers.isFileExist(createdPreview)).to.be.true;
            });
        });

        context('When video is mp4 format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(mp4Sample, mp4);
            });

            it('should create preview', async () => {
                const createdPreview = await Preview.create(mp4);
                expect(createdPreview).to.exist;
                expect(createdPreview).to.be.string;
                expect(path.isAbsolute(createdPreview)).to.be.true;
                expect(await helpers.isFileExist(createdPreview)).to.be.true;
            });
        });

        context('When video is mkv format', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
                fs.copyFileSync(mkvSample, mkv);
            });

            it('should create preview', async () => {
                const createdPreview = await Preview.create(mkv);
                expect(createdPreview).to.exist;
                expect(createdPreview).to.be.string;
                expect(path.isAbsolute(createdPreview)).to.be.true;
                expect(await helpers.isFileExist(createdPreview)).to.be.true;
            });
        });

        context('When video is not exist', () => {

            beforeEach(async () => {
                await del(path.join(videosDirectory, '*'));
            });

            it('should throw error when video is not exist', async () => {
                let hasThrown = false;
                try {
                    await Preview.create(mkv);
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
