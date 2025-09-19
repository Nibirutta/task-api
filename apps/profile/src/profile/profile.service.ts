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
    ChangeLanguageDto,
    ChangeNameDto,
    ChangeNotificationDto,
    ChangeThemeDto,
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

    async changeName(ownerId: string, changeNameDto: ChangeNameDto) {
        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { owner: ownerId },
            { name: changeNameDto.name },
            { runValidators: true, new: true },
        );

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }

    async changeTheme(ownerId: string, changeThemeDto: ChangeThemeDto) {
        const updatedProfile = await this.profileModel
            .findOneAndUpdate(
                { owner: ownerId },
                {
                    $set: { 'preferences.theme': changeThemeDto.theme },
                },
                {
                    runValidators: true,
                    new: true,
                },
            )
            .exec();

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }

    async changeLanguage(
        ownerId: string,
        changeLanguageDto: ChangeLanguageDto,
    ) {
        const updatedProfile = await this.profileModel
            .findOneAndUpdate(
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
            )
            .exec();

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }

    async changeNotification(
        ownerId: string,
        changeNotificationDto: ChangeNotificationDto,
    ) {
        const updatePath = `preferences.notification.${changeNotificationDto.notificationType}`;

        const updatedProfile = await this.profileModel
            .findOneAndUpdate(
                { owner: ownerId },
                {
                    $set: { [updatePath]: changeNotificationDto.activate },
                },
                {
                    runValidators: true,
                    new: true,
                },
            )
            .exec();

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }

    async ownerUpdated(ownerId: string) {
        const updatedProfile = await this.profileModel
            .findOneAndUpdate(
                { owner: ownerId },
                {},
                { runValidators: true, new: true },
            )
            .exec();

        if (!updatedProfile) throw new NotFoundException('Profile not found');

        return updatedProfile.toObject();
    }
}
