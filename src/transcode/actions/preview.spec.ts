import { Directory } from '../../utils/directory';
import { config } from '../../config';
import { Preview } from './preview';
import { expect } from 'chai';



const videosDirectory = Directory.createDirectory(config.videosDirectory);
const sampleVideosDirectory = Directory.createDirectory(config.sampleVideosDirectory);
const flv = 'flv.flv';
const mkv = 'mkv.mkv';
const mp4 = 'mp4.mp4';

describe('Preview action', () => {
    after(async () => {
        await videosDirectory.drop();
    });

    describe('#create()', () => {
        context('When input is valid', () => {

            beforeEach(() => {
                videosDirectory.add(sampleVideosDirectory.getFilePath(flv))
            });

            it('should create preview', async () => {
                const createdPreview = await Preview.create(videosDirectory.dir, flv);
                expect(createdPreview).to.exist;
                expect(createdPreview).to.be.string;
            });
        });
    });
});