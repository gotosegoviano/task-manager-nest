import {
  Injectable,
  NotFoundException, // Importamos la excepción
  ConflictException, // Importamos otra para errores de datos duplicados
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, QueryFailedError, Like } from 'typeorm'; // Importamos QueryFailedError
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

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
  findAll(filterDto: FilterUsersDto): Promise<User[]> {
    const findOptions: FindManyOptions<User> = {
      where: {}, // Inicializamos un objeto 'where' vacío
    };

    if (filterDto.role) {
      findOptions.where = { ...findOptions.where, role: filterDto.role };
    }

    if (filterDto.name) {
      // Usamos el operador Like para buscar nombres que contengan el valor
      findOptions.where = { ...findOptions.where, name: Like(`%${filterDto.name}%`) };
    }

    if (filterDto.email) {
      findOptions.where = { ...findOptions.where, email: filterDto.email };
    }

    return this.usersRepository.find(findOptions);
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
