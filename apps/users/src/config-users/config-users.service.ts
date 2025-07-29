import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEYS } from 'libs/common/src/constants/env-keys.constants';

@Injectable()
export class ConfigUsersService {
  constructor(private readonly configService: ConfigService) {}

  getUsersClientPort(): number {
    const usersPort = this.configService.get<number>(
      ENV_KEYS.USERS_CLIENT_PORT,
    );

    if (!usersPort) {
      throw new Error(`${ENV_KEYS.USERS_CLIENT_PORT} is missing or invalid, please check the config module, .env file or the env_keys.`);
    }

    return usersPort;
  }
}
