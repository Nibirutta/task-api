import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { ENV_KEYS } from '@app/common';

@Injectable()
export class ClientConfigService {
  constructor(private readonly configService: ConfigService) {}

  getMicroservicePort(key: string): number {
    const port = this.configService.get<number>(key);

    if (!port) {
      throw new Error(
        `${key} is missing or invalid, please check the config module, .env file or the env_keys.`,
      );
    }

    return port;
  }

  get usersClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getMicroservicePort(ENV_KEYS.USERS_MICROSERVICE_PORT),
      },
    };
  }

  get authClientOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        port: this.getMicroservicePort(ENV_KEYS.AUTH_MICROSERVICE_PORT),
      },
    };
  }
}
