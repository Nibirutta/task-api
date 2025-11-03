import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schemas/Profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from '../dto';
import { Languages, NotificationsTypes, Themes } from '@app/common';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private readonly profileModel: Model<Profile>,
    ) {}

    async findProfile(ownerId: string) {
        const foundProfile = await this.profileModel.findOne({
            owner: ownerId,
        });

        if (!foundProfile) throw new NotFoundException('Profile not found');

        return foundProfile;
    }

    async createProfile(createProfileDto: CreateProfileDto) {
        const newProfile = await this.profileModel.create(createProfileDto);

        return newProfile;
    }

    async updateProfile(
        ownerId: string,
        name?: string,
        theme?: Themes,
        language?: Languages,
        notificationType?: NotificationsTypes,
        isActivated?: boolean,
    ) {
        const notificationUpdatePath = `preferences.notification.${notificationType}`;

        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            {
                name: name,
                $set: {
                    'preferences.theme': theme,
                    'preferences.language': language,
                    [notificationUpdatePath]: isActivated,
                },
            },
            { runValidators: true, new: true },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }

    async deleteProfile(ownerId: string) {
        const deletedProfile = await this.profileModel.findOneAndDelete({
            owner: ownerId,
        });

        if (!deletedProfile) throw new NotFoundException('Profile not found');

        return deletedProfile;
    }
}
