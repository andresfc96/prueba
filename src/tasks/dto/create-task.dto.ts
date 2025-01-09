import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsArray()
  @IsOptional()
  user_ids?: number[];
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
