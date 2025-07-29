import { Test, TestingModule } from '@nestjs/testing';
import { ClientUsersService } from './client-users.service';

describe('ClientUsersService', () => {
  let service: ClientUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientUsersService],
    }).compile();

    service = module.get<ClientUsersService>(ClientUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
