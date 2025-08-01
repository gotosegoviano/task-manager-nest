import { IsString, IsNumber, IsDate, IsEnum, IsArray, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string.' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description: string;

  @IsNumber({}, { message: 'Estimated hours must be a number.' })
  estimatedHours: number;

  @Type(() => Date)
  @IsDate({ message: 'Due date must be a valid date.' })
  dueDate: Date;

  @IsEnum(TaskStatus, { message: 'Status must be one of the following values: activa or terminada.' })
  status: TaskStatus;

  @IsNumber({}, { message: 'Monetary cost must be a number.' })
  monetaryCost: number;

  @IsOptional()
  @IsArray({ message: 'Assigned user IDs must be an array.' })
  @IsUUID('4', { each: true, message: 'Each assigned user ID must be a valid UUID.' })
  assignedUserIds?: string[];
}
