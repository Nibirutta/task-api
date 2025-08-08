import { Controller, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import {
  LoginRequestDto,
  RegisterRequestDto,
  UpdateRequestDto,
} from '@app/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ClientAuthService } from './client-auth.service';

@Controller('auth')
export class ClientAuthController {
  constructor(private readonly authClient: ClientAuthService) {}

  @Post('register')
  create(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authClient.create(registerRequestDto);
  }

  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authClient.login(loginRequestDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.authClient.update(id, updateRequestDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.authClient.delete(id);
  }
}
