import { Controller, Get, Post, Body, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

// Asegúrate de que la palabra clave 'export' esté aquí
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  /**
   * Creates a new user.
   * @param createUserDto - Data transfer object containing the information needed to create a user.
   * @returns Promise that resolves to the created User entity.
   * @throws ConflictException if a user with the same email already exists.
   * @throws QueryFailedError for other database-related errors.
   */
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  /**
   * Finds all users that match the given filter.
   * @param filterDto - Data transfer object containing the information needed to filter users.
   * @returns Promise that resolves to an array of User entities.
   */
  findAll(@Query() filterDto: FilterUsersDto) {
    return this.usersService.findAll(filterDto);
  }
}
