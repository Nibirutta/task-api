import { Injectable } from '@nestjs/common';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
export class TokenConfigService {
    private readonly tokenExpirations = {
        [TokenType.ACCESS]: {
            duration: '1m',
            milliseconds: 60 * 1000,
            minutes: 1,
        },
        [TokenType.SESSION]: {
            duration: '3d',
            milliseconds: 3 * 24 * 60 * 60 * 1000,
            minutes: 4320, // 3 Days
        },
        [TokenType.RESET]: {
            duration: '30m',
            milliseconds: 30 * 60 * 1000,
            minutes: 30,
        },
    };

    getTokenDuration(tokenType: TokenType): string {
        return this.tokenExpirations[tokenType].duration;
    }

    getTokenExpirationDate(tokenType: TokenType): Date {
        const expirationDate = new Date();
        expirationDate.setMinutes(
            expirationDate.getMinutes() +
                this.tokenExpirations[tokenType].minutes,
        );

        return expirationDate;
    }

    getTokenMaxAge(tokenType: TokenType): number {
        return this.tokenExpirations[tokenType].milliseconds;
    }
}
