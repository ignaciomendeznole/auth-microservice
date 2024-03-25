import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { LoginUserDto, RegisterUserDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  async signToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    this.logger.log('registerUser', registerUserDto);
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

      return {
        user: newUser,
        token: await this.signToken({
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        }),
      };
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

      const isPasswordValid = bcrypt.compareSync(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new RpcException({
          message: 'Invalid password',
          status: 400,
        });
      }

      return {
        user,
        token: await this.signToken({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.code,
      });
    }
  }

  async verifyToken(token: string) {
    try {
      const user = this.jwtService.verify(token, { secret: envs.jwtSecret });

      delete user.iat;
      delete user.exp;
      delete user.sub;

      return {
        user,
        token: await this.signToken(user),
      };
    } catch (error) {
      throw new RpcException({
        message: 'Invalid token',
        status: 400,
      });
    }
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
