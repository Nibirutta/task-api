import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigAuthService {
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
}
