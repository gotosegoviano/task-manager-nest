import {
  Injectable,
  NotFoundException, // Importamos la excepción
  ConflictException, // Importamos otra para errores de datos duplicados
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm'; // Importamos QueryFailedError
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { TaskStatus } from '@app/common/enums/task-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the database.
   * @param createUserDto - Data transfer object containing the information needed to create a user.
   * @returns Promise that resolves to the created User entity.
   * @throws ConflictException if a user with the same email already exists.
   * @throws QueryFailedError for other database-related errors.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key')) {
        // Por ejemplo, si el email ya existe
        throw new ConflictException('User with this email already exists.');
      }
      // Para cualquier otro error de la base de datos, lanzamos una excepción genérica
      throw error;
    }
  }

  /**
   * Finds a user by its ID.
   * @param id - The ID of the user to be found.
   * @returns Promise that resolves to the found User entity.
   * @throws {NotFoundException} if no user with the given ID exists.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  /**
   * Finds all users that match the given filter.
   * @param filterDto - Data transfer object containing the information needed to filter users.
   * @returns Promise that resolves to an array of User entities.
   */
  async findAll(filterDto: FilterUsersDto): Promise<any[]> {
    const { role } = filterDto;
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Eagerly load the tasks relationship for each user
    queryBuilder.leftJoinAndSelect('user.tasks', 'tasks');

    // Filtering logic
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Get the users and their related tasks from the database
    const users = await queryBuilder.getMany();

    // Process each user to calculate completed tasks and total cost
    return users.map((user) => {
      // Destructure the user object to separate tasks from other data
      const { tasks, ...userData } = user;

      // Filter the tasks to get only those that are 'terminada'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const completedTasks = tasks.filter((task) => task.status === TaskStatus.TERMINADA);

      // Calculate the count of completed tasks
      const completedTasksCount = completedTasks.length;

      // Calculate the sum of the monetary cost of all completed tasks
      const totalCompletedTasksCost = completedTasks.reduce(
        (sum, task) => sum + parseFloat(String(task.monetaryCost)),
        0,
      );

      // Return a new object with the user data and the new calculated properties
      return {
        ...userData,
        completedTasksCount,
        totalCompletedTasksCost: parseFloat(totalCompletedTasksCost.toFixed(2)),
      };
    });
  }

  /**
   * Deletes a user by id.
   * @throws {NotFoundException} if a user with the given id does not exist.
   */
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
  }
}
