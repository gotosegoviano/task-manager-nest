import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  /**
   * Creates a new task.
   * @param createTaskDto - Data transfer object containing the information needed to create a task.
   * @returns Promise that resolves to the created Task entity.
   * @throws {ConflictException} if a task with the same title already exists.
   * @throws {QueryFailedError} for other database-related errors.
   */
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  /**
   * Finds all tasks.
   * @returns Promise that resolves to an array of Task entities.
   */
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  /**
   * Finds a task by its ID.
   * @param id - The ID of the task to be found.
   * @returns Promise that resolves to the found Task entity.
   * @throws {NotFoundException} if no task with the given ID exists.
   */
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  /**
   * Updates a task.
   * @param id - The ID of the task to be updated.
   * @param updateTaskDto - Data transfer object containing the information needed to update a task.
   * @returns Promise that resolves to the updated Task entity.
   * @throws {NotFoundException} if the task with the given ID does not exist.
   * @throws {NotFoundException} if one or more assigned users do not exist.
   */
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  /**
   * Deletes a task by id.
   * @param id - The ID of the task to be deleted.
   * @returns Promise that resolves to nothing.
   * @throws {NotFoundException} if a task with the given ID does not exist.
   */
  async remove(@Param('id', ParseUUIDPipe) id: string, @Body('role') role: string) {
    // Ensure only users with the 'admin' role can delete tasks
    if (role !== 'admin') {
      throw new ForbiddenException('Only administrators can delete tasks.');
    }

    await this.tasksService.remove(id);
  }
}
