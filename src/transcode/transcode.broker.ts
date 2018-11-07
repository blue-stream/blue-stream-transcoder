import * as rabbit from 'rabbit-lite';
import * as amqp from 'amqplib';
import { config } from '../config';
import { TranscodeController } from './transcode.contoller';
import { IVideo } from './video.interface';

export class TranscodeBroker {
    public static async assertExchanges() {
        await rabbit.assertExchange('application', 'topic');
    }

    public static async subscribe() {
        await rabbit.subscribe('transcoder-transcode-queue',
                               { exchange : 'application', pattern : 'video.upload.finish' },
                               async (video: Object) => {
                                   try {
                                       await TranscodeController.transcode((video as IVideo).path);
                                       rabbit.publish('application', 'video.transcode.finish', video);
                                   } catch (error) {
                                       rabbit.publish('application', 'video.transcode.failed', video);
                                       throw new Error(error);
                                   }
                               },
                            );

    }

}
