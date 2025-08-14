import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/User.schema';
import { AppConfigService, AUTH_CLIENT } from '@app/common';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: AUTH_CLIENT,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.authClientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
})
export class UsersModule {}
