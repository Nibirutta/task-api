import { Module } from '@nestjs/common';
import { ConfigUsersModule } from './config-users/config-users.module';

@Module({
  imports: [ConfigUsersModule],
  controllers: [],
  providers: [],
})
export class UsersModule {}
