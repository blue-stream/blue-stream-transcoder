import * as rabbit from 'rabbit-lite';
import * as amqp from 'amqplib';
import { config } from '../config';
import { TranscodeController } from './transcode.contoller';
import { IVideo } from './video.interface';

export class TranscodeBroker {
    public static async assertExchanges() {
        await rabbit.assertExchange('video', 'topic');
    }

    public static async publish(exchange: string,
                                routingKey: string,
                                message: Object,
                                options?: amqp.Options.Publish) {
        rabbit.publish('application', routingKey, message, options);
    }

    public static async subscribe() {
        await rabbit.subscribe('video-transcode-queue',
                               { exchange : 'video', pattern : 'video.upload.finish' },
                               (video: IVideo | any) => {
                                   return TranscodeController.transcode(video.path);
                               });
    }

}
