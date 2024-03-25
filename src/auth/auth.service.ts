import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    return this.natsClient.send('auth.register.user', registerUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login.user', loginUserDto);
  }

  async verifyToken(token: string) {
    return this.natsClient.send('auth.verify.user', token);
  }
}
