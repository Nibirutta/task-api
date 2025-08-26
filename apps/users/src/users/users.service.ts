import {
    Injectable,
    Inject,
    OnApplicationBootstrap,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import {
    AUTH_PATTERNS,
    CreatePersonalDataDto,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Connected to transporter');
    }

    async createUser(createPersonalDataDto: CreatePersonalDataDto) {
        const isValid = await this.transporter.send(
            AUTH_PATTERNS.VALIDATE_USER,
            createPersonalDataDto.owner,
        );

        if (!isValid) {
            throw new NotFoundException('User ID invalid');
        }

        const newUser = await this.userModel.create(createPersonalDataDto);

        return newUser.toObject();
    }
}
