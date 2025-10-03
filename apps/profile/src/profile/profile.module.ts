import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../schemas/Profile.schema';

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
