import { Expose, Type } from 'class-transformer';
import { ProfileResponseDto } from './profile-response.dto';

export class SessionResponseDto {
    @Expose()
    @Type(() => ProfileResponseDto)
    profile: ProfileResponseDto;

    @Expose()
    accessToken: string;

    @Expose()
    sessionToken: string;
}
