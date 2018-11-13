import * as rabbit from 'rabbit-lite';
import * as amqp from 'amqplib';
import { config } from '../config';
import { TranscodeController } from './transcode.contoller';
import { IUploadedVideo, ITranscodedVideo } from './video.interface';

export class TranscodeBroker {
    public static async assertExchanges() {
        await rabbit.assertExchange('application', 'topic');
    }

    public static async subscribe() {
        await rabbit.subscribe('transcoder-transcode-queue',
                               { exchange : 'application', pattern : 'video.upload.succeeded' },
                               async (video: any) => {
                                   try {
                                       const products: string[] = await TranscodeController.transcode((video as IUploadedVideo).key);
                                       const newVideo: ITranscodedVideo  = {
                                           id: (video as IUploadedVideo).id,
                                           thumbnailPath: products[0],
                                           previewPath: products[1],
                                           contentPath: products[2],
                                       };
                                       rabbit.publish('application', 'transcoder.transcode.succeeded', newVideo);
                                   } catch (error) {
                                       rabbit.publish('application', 'transcoder.transcode.failed', video);
                                       throw error;
                                   }
                               },
                            );

    }

}
