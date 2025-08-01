import { IsOptional, IsDateString, IsString, IsUUID } from 'class-validator';

// This DTO defines the optional query parameters for filtering and sorting tasks.
export class FilterTasksDto {
  @IsOptional()
  @IsDateString({}, { message: 'The due date must be a valid date string (e.g., YYYY-MM-DD).' })
  dueDate?: string;

  @IsOptional()
  @IsString({ message: 'The task title must be a string.' })
  title?: string;

  @IsOptional()
  @IsUUID('4', { message: 'The assigned user ID must be a valid UUID.' })
  assignedUserId?: string;

  @IsOptional()
  @IsString({ message: 'The assigned user name or email must be a string.' })
  assignedUserNameOrEmail?: string;

  @IsOptional()
  @IsString({ message: "Sort order must be 'ASC' or 'DESC'." })
  sortOrder?: 'ASC' | 'DESC';
}
