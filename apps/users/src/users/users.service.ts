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
import { lastValueFrom, timeout, retry } from 'rxjs';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Users microservice connected to transporter');
    }

    async createUser(createPersonalDataDto: CreatePersonalDataDto) {
        try {
            await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.FIND, createPersonalDataDto.owner)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }

        const newUser = await this.userModel.create(createPersonalDataDto);

        return newUser.toObject();
    }

    async deleteUser(ownerId: string) {
        const foundUser = await this.userModel.findOneAndDelete({
            owner: ownerId,
        });

        if (!foundUser) throw new NotFoundException('User not found');

        return foundUser.toObject();
    }

    async findUser(ownerId: string) {
        const foundUser = await this.userModel.findOne({
            owner: ownerId,
        });

        if (!foundUser) throw new NotFoundException('User not found');

        return foundUser.toObject();
    }
}
