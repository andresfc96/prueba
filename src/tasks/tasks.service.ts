import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import {
  ChangeTaskStatusResponse,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTasksResponse,
  UpdateTaskResponse,
} from './interfaces/task.interfaces';
import { PrismaService } from 'prisma/prisma.service';
import { statusTask } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    try {
      await this.prismaService.tasks.create({
        data: {
          name: createTaskDto.name,
          title: createTaskDto.title,
          description: createTaskDto.description,
          deadline: createTaskDto.deadline,
          userTasks: {
            create:
              createTaskDto.user_ids?.map((user_id) => ({
                user: { connect: { id: user_id } },
              })) || [],
          },
        },
      });

      return {
        status: 'ok',
        message: 'Task created successfully',
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to create task', 500);
      }
    }
  }

  async getTasks(): Promise<GetTasksResponse> {
    try {
      const tasks = await this.prismaService.tasks.findMany({
        orderBy: { name: 'asc' },
        include: { userTasks: true },
      });

      return {
        status: 'ok',
        message: 'Fetch tasks successfully',
        data: tasks,
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to fetch tasks', 500);
      }
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<UpdateTaskResponse> {
    if (!updateTaskDto.id) {
      throw new BadRequestException('Task ID is required');
    }

    try {
      const task = await this.prismaService.tasks.findUnique({
        where: { id: updateTaskDto.id },
      });

      if (!task) {
        throw new NotFoundException(
          `Task with id ${updateTaskDto.id} not found`,
        );
      }

      await this.prismaService.$transaction(async (prisma) => {
        await prisma.userTasks.deleteMany({
          where: { task_id: updateTaskDto.id },
        });

        await prisma.tasks.update({
          where: { id: updateTaskDto.id },
          data: {
            name: updateTaskDto.name,
            title: updateTaskDto.title,
            description: updateTaskDto.description,
            deadline: updateTaskDto.deadline,
            userTasks: {
              create:
                updateTaskDto.user_ids?.map((user_id) => ({
                  user: { connect: { id: user_id } },
                })) || [],
            },
          },
        });
      });

      return {
        status: 'ok',
        message: 'Task update successfully',
        statusCode: 201,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to update task', 500);
      }
    }
  }

  async deleteTask(task_id: number): Promise<DeleteTaskResponse> {
    try {
      const task = await this.prismaService.tasks.findUnique({
        where: { id: Number(task_id) },
      });

      if (!task) {
        throw new NotFoundException(`Task with id ${task_id} not found`);
      }

      await this.prismaService.tasks.delete({ where: { id: Number(task_id) } });

      return {
        status: 'ok',
        message: 'Task deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to delete task', 500);
      }
    }
  }

  async changeTaskStatus(
    task_id: number,
    direction: 'next' | 'previous',
  ): Promise<ChangeTaskStatusResponse> {
    if (!task_id) {
      throw new BadRequestException('Task ID is required');
    }

    if (!direction) {
      throw new BadRequestException('Direction is required [next, previous]');
    }
    try {
      const task = await this.prismaService.tasks.findUnique({
        where: { id: Number(task_id) },
      });

      if (!task) {
        throw new NotFoundException(`Task with id ${task_id} not found`);
      }

      const statusOrder = ['TO_DO', 'IN_PROGRESS', 'DONE'];
      const currentIndex = statusOrder.indexOf(task.status);

      let newIndex;
      if (direction === 'next') {
        newIndex = Math.min(currentIndex + 1, statusOrder.length - 1);
      } else if (direction === 'previous') {
        newIndex = Math.max(currentIndex - 1, 0);
      }

      const newStatus = statusOrder[newIndex];

      await this.prismaService.tasks.update({
        where: { id: Number(task_id) },
        data: { status: newStatus as statusTask },
      });

      return {
        status: 'ok',
        message: `Task status updated to ${newStatus}`,
        statusCode: 200,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new HttpException('Failed to change task status', 500);
      }
    }
  }
}
