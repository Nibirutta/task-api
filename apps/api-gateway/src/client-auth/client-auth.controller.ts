import { Controller, Post, Body, Patch, Delete, Param, UseInterceptors } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto, UpdateRequestDto } from '@app/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

import { ClientAuthService } from './client-auth.service';
import { RpcExceptionInterceptor } from '../interceptors/rpc-exception.interceptor';

@Controller('auth')
@UseInterceptors(RpcExceptionInterceptor)
export class ClientAuthController {
  constructor(private readonly authClient: ClientAuthService) {}

  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authClient.login(loginRequestDto);
  }

  @Post()
  create(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authClient.create(registerRequestDto);
  }

  @Patch()
  update(@Body() updateRequestDto: UpdateRequestDto) {
    return this.authClient.update(updateRequestDto);
  }

  // Build a pipe to validade objectids or use the build in by mongoose
  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.authClient.delete(id);
  }
}
