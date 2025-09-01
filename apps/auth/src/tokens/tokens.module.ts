import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, Token } from '../schemas/Token.schema';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService, TRANSPORTER_PROVIDER } from '@app/common';
import { ClientProxyFactory } from '@nestjs/microservices';

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
    providers: [
        TokensService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
})
export class TokensModule {}
