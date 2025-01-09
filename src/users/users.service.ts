import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateUserResponse,
  GetUserByEmailResponse,
  GetUserByIdResponse,
  GetUsersResponse,
} from './interfaces/user.interfaces';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { username: createUserDto.username },
      });

      if (user) {
        throw new ConflictException(
          `Username ${createUserDto.username} already exists.`,
        );
      }

      const hashedPassword = await this.encryptPassword(createUserDto.password);

      await this.prismaService.users.create({
        data: {
          username: createUserDto.username,
          password: hashedPassword,
          email: createUserDto.email,
        },
      });

      return {
        status: 'ok',
        message: 'User created successfully',
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to create user', 500);
      }
    }
  }

  async getUsers(): Promise<GetUsersResponse> {
    try {
      const users = await this.prismaService.users.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { username: 'asc' },
        include: { userTasks: true },
      });

      return {
        status: 'ok',
        message: 'Fetch users successfully',
        data: users,
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to create user', 500);
      }
    }
  }

  async getUserById(id: string): Promise<GetUserByIdResponse> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: Number(id) },
      });

      return {
        status: 'ok',
        message: 'Fetch user by id successfully',
        data: user,
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        console.log(error);
        throw new HttpException('Failed to fetch user', 500);
      }
    }
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { email: email },
      });

      return {
        status: 'ok',
        message: 'Fetch user by email successfully',
        data: user,
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to fetch user', 500);
      }
    }
  }

  async encryptPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred during password encryption',
        error,
      );
    }
  }
}
