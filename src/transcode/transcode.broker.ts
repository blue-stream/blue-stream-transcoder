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
                                       console.log('get message');
                                       await TranscodeController.transcode((video as IVideo).path);
                                       rabbit.publish('application', 'video.transcode.finish', video);
                                       console.log('publish message');
                                   } catch (error) {
                                       rabbit.publish('application', 'video.transcode.failed', video);
                                       console.log('publish error', error);
                                       throw new Error(error);
                                   }
                               },
                            );

    }

}
