import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ClientOptions,
    MicroserviceOptions,
    Transport,
} from '@nestjs/microservices';
import { ENV_KEYS } from '../constants/ENV_KEYS.constants';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    getData(key: string) {
        const data = this.configService.get(key);

        if (!data) {
            throw new Error(
                `${key} is missing or invalid, please check the config module, .env file or the env_keys.`,
            );
        }

        return data;
    }

    get clientOptions(): ClientOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.getData(ENV_KEYS.RABBITMQ_URL)],
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
                urls: [this.getData(ENV_KEYS.RABBITMQ_URL)],
                exchange: 'global_exchange',
                exchangeType: 'topic',
                wildcards: true,
            },
        };
    }
}
