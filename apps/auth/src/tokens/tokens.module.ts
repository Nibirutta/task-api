import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, Token } from '../schemas/Token.schema';
import { TokensService } from './tokens.service';
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
    providers: [TokensService],
    exports: [TokensService],
})
export class TokensModule {}
