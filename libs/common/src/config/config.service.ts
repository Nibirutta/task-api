import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ClientOptions,
    MicroserviceOptions,
    Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    getData(key: string) {
        const port = this.configService.get(key);

        if (!port) {
            throw new Error(
                `${key} is missing or invalid, please check the config module, .env file or the env_keys.`,
            );
        }

        return port;
    }

    get clientOptions(): ClientOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                exchange: 'global_exchange',
                exchangeType: 'topic',
                wildcards: true,
            },
        };
    }

    get microserviceOptions(): MicroserviceOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                exchange: 'global_exchange',
                exchangeType: 'topic',
                wildcards: true,
            },
        };
    }
}
