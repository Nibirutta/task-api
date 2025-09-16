import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../schemas/Profile.schema';
import { AppConfigService, TRANSPORTER_PROVIDER } from '@app/common';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Profile.name,
                schema: ProfileSchema,
            },
        ]),
    ],
    controllers: [ProfileController],
    providers: [
        ProfileService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
})
export class ProfileModule {}
