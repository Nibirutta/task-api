import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, Token } from '../schemas/Token.schema';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
    ],
    controllers: [TokensController],
    providers: [TokensService],
})
export class TokensModule {}
