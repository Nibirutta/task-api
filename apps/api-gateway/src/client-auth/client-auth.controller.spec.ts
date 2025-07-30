import { Test, TestingModule } from '@nestjs/testing';
import { ClientAuthController } from './client-auth.controller';

describe('ClientAuthController', () => {
  let controller: ClientAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAuthController],
    }).compile();

    controller = module.get<ClientAuthController>(ClientAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
