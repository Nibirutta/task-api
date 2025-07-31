import { Test, TestingModule } from '@nestjs/testing';
import { AuthCredentialsController } from './auth-credentials.controller';

describe('AuthCredentialsController', () => {
  let controller: AuthCredentialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthCredentialsController],
    }).compile();

    controller = module.get<AuthCredentialsController>(
      AuthCredentialsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
