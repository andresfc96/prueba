import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import {
  CreateTaskResponse,
  DeleteTaskResponse,
  GetTasksResponse,
  UpdateTaskResponse,
} from './interfaces/task.interfaces';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createTask')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<CreateTaskResponse> {
    try {
      return this.tasksService.createTask(createTaskDto);
    } catch (error) {
      throw new Error(`Error in createUser: ${error}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTasks')
  async getTasks(): Promise<GetTasksResponse> {
    try {
      return this.tasksService.getTasks();
    } catch (error) {
      throw new Error(`Error in getTasks: ${error}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateTask')
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateTaskResponse> {
    try {
      return this.tasksService.updateTask(updateTaskDto);
    } catch (error) {
      throw new Error(`Error in updateTask: ${error}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteTask/:id')
  async deleteTask(@Param('id') id: number): Promise<DeleteTaskResponse> {
    return this.tasksService.deleteTask(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changeStatus/:id')
  async changeTaskStatus(
    @Param('id') id: number,
    @Body('direction') direction: 'next' | 'previous',
  ): Promise<UpdateTaskResponse> {
    return this.tasksService.changeTaskStatus(id, direction);
  }
}
