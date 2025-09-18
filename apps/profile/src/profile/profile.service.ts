import {
    Injectable,
    Inject,
    OnApplicationBootstrap,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schemas/Profile.schema';
import { Model } from 'mongoose';
import {
    AUTH_PATTERNS,
    CreateProfileDto,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry } from 'rxjs';

@Injectable()
export class ProfileService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(Profile.name)
        private readonly profileModel: Model<Profile>,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Profile microservice connected to transporter');
    }

    async createProfile(createProfileDto: CreateProfileDto) {
        try {
            await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.FIND, createProfileDto.owner)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }

        const newProfile = await this.profileModel.create(createProfileDto);

        return newProfile.toObject();
    }

    async deleteProfile(ownerId: string) {
        const deletedProfile = await this.profileModel.findOneAndDelete({
            owner: ownerId,
        });

        if (!deletedProfile) throw new NotFoundException('Profile not found');

        return deletedProfile.toObject();
    }

    async findProfile(ownerId: string) {
        const foundProfile = await this.profileModel.findOne({
            owner: ownerId,
        });

        if (!foundProfile) throw new NotFoundException('Profile not found');

        return foundProfile.toObject();
    }

    async ownerUpdated(ownerId: string) {
        const updatedProfile =
            await this.profileModel.findByIdAndUpdate(ownerId);

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }
}
