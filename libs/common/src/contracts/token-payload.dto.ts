import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

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

export class SessionTokenPayloadDto extends BaseTokenPayloadDto {}

export class ResetTokenPayloadDto extends BaseTokenPayloadDto {}
