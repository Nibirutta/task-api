import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, Token } from '../schemas/Token.schema';
import { TokensController } from './tokens.controller';
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
    controllers: [TokensController],
    providers: [TokensService],
})
export class TokensModule {}
