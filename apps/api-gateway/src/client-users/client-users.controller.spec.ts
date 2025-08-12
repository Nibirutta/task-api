import { Test, TestingModule } from '@nestjs/testing';
import { ClientUsersController } from './client-users.controller';

describe('ClientUsersController', () => {
    let controller: ClientUsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientUsersController],
        }).compile();

        controller = module.get<ClientUsersController>(ClientUsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
