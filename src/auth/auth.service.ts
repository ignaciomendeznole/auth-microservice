import { Injectable, OnModuleInit } from '@nestjs/common';

import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  onModuleInit() {
    this.$connect();
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const user = await this.findUserByEmail(registerUserDto.email);

      if (user) {
        throw new RpcException({
          message: 'User already exists',
          status: 400,
        });
      }

      const newUser = await this.user.create({
        data: {
          email: registerUserDto.email,
          password: bcrypt.hashSync(registerUserDto.password, 10),
          firstName: registerUserDto.firstName,
          lastName: registerUserDto.lastName,
        },
      });

      delete newUser.password;

      return { user: newUser, token: 'token' };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.code,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const user = await this.findUserByEmail(loginUserDto.email);

      if (!user) {
        throw new RpcException({
          message: 'User not found',
          status: 404,
        });
      }

      if (user.password !== loginUserDto.password) {
        throw new RpcException({
          message: 'Invalid password',
          status: 400,
        });
      }

      return user;
    } catch (error) {}
  }

  async verifyToken(token: string) {
    return {
      verified: token,
    };
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.code,
      });
    }
  }
}
