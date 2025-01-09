import { Task } from '../entities/task.entity';

export interface CreateTaskResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface UpdateTaskResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface DeleteTaskResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface ChangeTaskStatusResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface GetTasksResponse {
  status: string;
  message: string;
  data: Task[];
  statusCode: number;
}

export interface GetTaskByIdResponse {
  status: string;
  message: string;
  data: Task;
  statusCode: number;
}

export interface GetTaskByEmailResponse {
  status: string;
  message: string;
  data: Task;
  statusCode: number;
}
