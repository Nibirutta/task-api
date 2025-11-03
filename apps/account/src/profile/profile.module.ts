import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../schemas/Profile.schema';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Profile.name,
                schema: ProfileSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
