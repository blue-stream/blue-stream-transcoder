import * as rabbit from '../utils/rabbit';
import { TranscodeController } from './transcode.contoller';
import { IUploadedVideo, ITranscodedVideo } from './video.interface';
import { config } from '../config';

export class TranscodeBroker {

    public static async subscribe() {
        rabbit.subscribe(
            'application',
            'topic',
            'transcoder-transcode-queue',
            'videoService.video.upload.succeeded',
            async (messageData: {id: string, key: string, userId: string}) => {
                try {
                    const products: string[] = await TranscodeController.transcode(messageData.key);
                    const newVideo: ITranscodedVideo = {
                        id: messageData.id,
                        thumbnailPath: products[0],
                        previewPath: products[1],
                        contentPath: products[2],
                    };
                    rabbit.publish('application', 'topic', 'transcoder.video.transcode.succeeded', {...newVideo, userId: messageData.userId });
                } catch (error) {
                    rabbit.publish('application', 'topic', 'transcoder.video.transcode.failed', messageData);
                    throw error;
                }
            },
            {
                consumer: {
                    noAck: false,
                },
                exchange: {
                    durable: true,
                },
                queue: {
                    durable: true,
                },
                channel: {
                    prefetch: config.parallelTranscode,
                },
            },
        );
    }
}
