import { User } from '../entities/user.entity';

export interface CreateUserResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface GetUsersResponse {
  status: string;
  message: string;
  data: User[];
  statusCode: number;
}

export interface GetUserByIdResponse {
  status: string;
  message: string;
  data: User;
  statusCode: number;
}

export interface GetUserByEmailResponse {
  status: string;
  message: string;
  data: User;
  statusCode: number;
}
