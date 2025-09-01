import {
    IsDate,
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { IUserPreferences } from '../interfaces/user-preferences.interface';

export class BaseTokenPayloadDto {
    @IsNotEmpty()
    @IsMongoId()
    sub: string;
}

export class AccessTokenPayloadDto extends BaseTokenPayloadDto {
    @IsNotEmpty()
    @IsString()
    username: string;
}

export class SessionTokenPayloadDto extends BaseTokenPayloadDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsObject()
    preferences: IUserPreferences;

    @IsNotEmpty()
    @IsDate()
    userCreatedAt: Date;

    @IsNotEmpty()
    @IsDate()
    userUpdatedAt: Date;
}

export class ResetTokenPayloadDto extends BaseTokenPayloadDto {}
