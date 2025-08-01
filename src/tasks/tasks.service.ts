import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new task.
   * @param createTaskDto - Data transfer object containing the information needed to create a task.
   * @returns Promise that resolves to the created Task entity.
   * @throws NotFoundException if one or more assigned users do not exist.
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { assignedUserIds, ...taskData } = createTaskDto;
    const task = this.tasksRepository.create(taskData);

    if (assignedUserIds && assignedUserIds.length > 0) {
      const assignedUsers = await this.usersRepository.findBy({
        id: In(assignedUserIds),
      });

      // We handle the case where some assigned users may not exist
      if (assignedUsers.length !== assignedUserIds.length) {
        throw new NotFoundException('One or more assigned users not found.');
      }
      task.assignedUsers = assignedUsers;
    }

    return await this.tasksRepository.save(task);
  }

  /**
   * Retrieves all tasks with their assigned users.
   * @returns Promise that resolves to an array of Task entities.
   */

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['assignedUsers'] });
  }

  /**
   * Finds a task by its ID.
   * @param id - The ID of the task to be found.
   * @returns Promise that resolves to the found Task entity.
   * @throws {NotFoundException} if no task with the given ID exists.
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedUsers'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  /**
   * Updates a task.
   * @param id - The ID of the task to be updated.
   * @param updateTaskDto - Data transfer object containing the information needed to update a task.
   * @returns Promise that resolves to the updated Task entity.
   * @throws {NotFoundException} if the task with the given ID does not exist.
   * @throws {NotFoundException} if one or more assigned users do not exist.
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id); // Reuse findOne for validation

    // Update the properties
    Object.assign(task, updateTaskDto);

    if (updateTaskDto.assignedUserIds) {
      const assignedUsers = await this.usersRepository.findBy({
        id: In(updateTaskDto.assignedUserIds),
      });
      // Handle the case where some assigned users may not exist
      if (assignedUsers.length !== updateTaskDto.assignedUserIds.length) {
        throw new NotFoundException('One or more assigned users not found.');
      }
      task.assignedUsers = assignedUsers;
    }

    return await this.tasksRepository.save(task);
  }

  /**
   * Deletes a task by id.
   * @param id - The ID of the task to be deleted.
   * @returns Promise that resolves to nothing.
   * @throws {NotFoundException} if a task with the given ID does not exist.
   */
  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
