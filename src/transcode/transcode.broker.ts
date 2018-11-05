import * as rabbit from 'rabbit-lite';
import * as amqp from 'amqplib';
import { config } from '../config';
import { TranscodeController } from './transcode.contoller';
import { IVideo } from './video.interface';

export class TranscodeBroker {
    public static async assertExchanges() {
        await rabbit.assertExchange('transcoder', 'topic');
    }

    public static async subscribe() {
        await rabbit.subscribe('transcode-queue',
                               { exchange : 'uploader', pattern : 'video.upload.finish' },
                               async (video: Object) => {
                                   try {
                                       await TranscodeController.transcode((video as IVideo).path);
                                       rabbit.publish('transcoder', 'video.transcode.finished', video);
                                   } catch (error) {
                                       rabbit.publish('transcoder', 'video.transcode.failed', video);
                                       throw new Error(error);
                                   }
                               },
                            );

    }

}
