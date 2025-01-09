import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponse } from './interfaces/auth.interfaces';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          username: loginDto.username,
        },
      });

      if (user !== undefined && user !== null) {
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (isMatch) {
          const payload = {
            email: user.email,
            sub: loginDto.username,
          };

          const expiresIn = this.configService.get<string>(
            'JWT_EXPIRATION_TIME',
          );

          const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn,
          });

          await this.prismaService.users.update({
            where: {
              id: user.id,
            },
            data: {
              token: token,
            },
          });

          return {
            status: 'ok',
            message: 'Login successful',
            token: token,
            statusCode: 200,
          };
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new HttpException('Failed to login', 500);
      }
    }
  }
}
