import * as rabbit from '../utils/rabbit';
import * as amqp from 'amqplib';
import { config } from '../config';
import { TranscodeController } from './transcode.contoller';
import { IUploadedVideo, ITranscodedVideo } from './video.interface';

export class TranscodeBroker {

    public static async subscribe() {
        rabbit.subscribe(
        'application',
        'topic',
        'transcoder-transcode-queue',
        'videoService.video.upload.succeeded',
        async (video: any) => {
            try {
                const products: string[] = await TranscodeController.transcode((video as IUploadedVideo).key);
                const newVideo: ITranscodedVideo  = {
                    id: (video as IUploadedVideo).id,
                    thumbnailPath: products[0],
                    previewPath: products[1],
                    contentPath: products[2],
                };
                rabbit.publish('application', 'topic', 'transcoder.video.transcode.succeeded', newVideo);
            } catch (error) {
                rabbit.publish('application', 'topic', 'transcoder.video.transcode.failed', video);
                throw error;
            }
        },
        );

    }

}
