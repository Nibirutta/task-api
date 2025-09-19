import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    UseInterceptors,
    Request,
} from '@nestjs/common';
import { JwtGuard } from '../guard/jwt.guard';
import { SendProfileInterceptor } from '../interceptors/send-profile.interceptor';
import {
    ChangeLanguageDto,
    ChangeNameDto,
    ChangeNotificationDto,
    ChangeThemeDto,
} from '@app/common';
import { ClientProfileService } from './client-profile.service';

@UseGuards(JwtGuard)
@UseInterceptors(SendProfileInterceptor)
@Controller('profile')
export class ClientProfileController {
    constructor(private readonly profileService: ClientProfileService) {}

    @Get()
    getProfile(@Request() req) {
        return this.profileService.findProfile(req.user.sub);
    }

    @Post('name')
    changeName(@Request() req, @Body() changeNameDto: ChangeNameDto) {
        return this.profileService.changeName(req.user.sub, changeNameDto);
    }

    @Post('language')
    changeLanguage(
        @Request() req,
        @Body() changeLanguageDto: ChangeLanguageDto,
    ) {
        return this.profileService.changeLanguage(
            req.user.sub,
            changeLanguageDto,
        );
    }

    @Post('notification')
    changeNotification(
        @Request() req,
        @Body() changeNotificationDto: ChangeNotificationDto,
    ) {
        return this.profileService.changeNotification(
            req.user.sub,
            changeNotificationDto,
        );
    }

    @Post('theme')
    changeThemes(@Request() req, @Body() changeThemeDto: ChangeThemeDto) {
        return this.profileService.changeTheme(req.user.sub, changeThemeDto);
    }
}
