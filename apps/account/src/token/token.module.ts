import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, Token } from '../schemas/Token.schema';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        JwtModule,
    ],
    controllers: [],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
