import { Injectable, OnModuleInit } from '@nestjs/common';

import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  onModuleInit() {
    this.$connect();
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    return {
      registerUserDto,
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return {
      loginUserDto,
    };
  }

  async verifyToken(token: string) {
    return {
      verified: token,
    };
  }
}
