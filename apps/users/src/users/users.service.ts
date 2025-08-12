import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { AUTH_CLIENT, CreatePersonalDataDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy
    ) { }

    async onApplicationBootstrap() {
        await this.authClient.connect();
        console.log('Connected to auth microservice');
    }

    async createUser(
        id: string,
        createPersonalDataDto: CreatePersonalDataDto,
    ) { }
}
