import { Controller } from '@nestjs/common';
import { PROFILE_PATTERNS, CreateProfileDto } from '@app/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @MessagePattern(PROFILE_PATTERNS.CREATE)
    createUser(
        @Payload()
        createProfileDto: CreateProfileDto,
    ) {
        return this.profileService.createProfile(createProfileDto);
    }

    @MessagePattern(PROFILE_PATTERNS.DELETE)
    deleteUser(
        @Payload(ParseObjectIdPipe)
        ownerId: string,
    ) {
        return this.profileService.deleteProfile(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.FIND)
    findUser(@Payload(ParseObjectIdPipe) ownerId: string) {
        return this.profileService.findProfile(ownerId);
    }
}
