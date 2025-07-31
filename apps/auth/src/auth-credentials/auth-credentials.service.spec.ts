import { Test, TestingModule } from '@nestjs/testing';
import { AuthCredentialsService } from './auth-credentials.service';

describe('AuthCredentialsService', () => {
  let service: AuthCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthCredentialsService],
    }).compile();

    service = module.get<AuthCredentialsService>(AuthCredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
