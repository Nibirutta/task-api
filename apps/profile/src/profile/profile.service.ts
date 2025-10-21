import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schemas/Profile.schema';
import { Model } from 'mongoose';
import {
    ChangeLanguageDto,
    ChangeNameDto,
    ChangeNotificationDto,
    ChangeThemeDto,
    CreateProfileDto,
} from '@app/common';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private readonly profileModel: Model<Profile>,
    ) {}

    async createProfile(createProfileDto: CreateProfileDto) {
        const newProfile = await this.profileModel.create(createProfileDto);

        if (!newProfile)
            throw new InternalServerErrorException(
                'Impossible to create profile',
            );

        return newProfile;
    }

    async deleteProfile(ownerId: string) {
        const deletedProfile = await this.profileModel.findOneAndDelete({
            owner: ownerId,
        });

        if (!deletedProfile) throw new NotFoundException('Profile not found');

        return deletedProfile;
    }

    async findProfile(ownerId: string) {
        const foundProfile = await this.profileModel.findOne({
            owner: ownerId,
        });

        if (!foundProfile) throw new NotFoundException('Profile not found');

        return foundProfile;
    }

    async changeName(ownerId: string, changeNameDto: ChangeNameDto) {
        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            { name: changeNameDto.name },
            { runValidators: true, new: true },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }

    async changeTheme(ownerId: string, changeThemeDto: ChangeThemeDto) {
        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            {
                $set: { 'preferences.theme': changeThemeDto.theme },
            },
            {
                runValidators: true,
                new: true,
            },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }

    async changeLanguage(
        ownerId: string,
        changeLanguageDto: ChangeLanguageDto,
    ) {
        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            {
                $set: {
                    'preferences.language': changeLanguageDto.language,
                },
            },
            {
                runValidators: true,
                new: true,
            },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }

    async changeNotification(
        ownerId: string,
        changeNotificationDto: ChangeNotificationDto,
    ) {
        const updatePath = `preferences.notification.${changeNotificationDto.notificationType}`;

        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            {
                $set: { [updatePath]: changeNotificationDto.activate },
            },
            {
                runValidators: true,
                new: true,
            },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }

    async ownerUpdated(ownerId: string) {
        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            {},
            { runValidators: true, new: true },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile;
    }
}
