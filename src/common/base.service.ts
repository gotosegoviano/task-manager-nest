import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository, Equal } from 'typeorm';

/**
 * This abstract class BaseService provides a basic implementation for a service that interacts with a database repository.
 * Here's a brief explanation of each method:
 *
 * constructor: Initializes the service with a repository of type T.
 * findAll: Retrieves all entities of type T from the repository.
 * findOne: Retrieves a single entity of type T from the repository by its ID.
 * remove: Deletes an entity of type T from the repository by its ID.
 * Note that this class is abstract, meaning it cannot be instantiated directly and is intended to be extended by other classes.
 */
export abstract class BaseService<T extends { id: string }> {
  protected constructor(protected readonly repository: Repository<T>) {}

  /**
   * Retrieves all entities of type T from the repository.
   * @returns A promise resolving to an array of all entities of type T.
   * @throws InternalServerErrorException if an unexpected error occurs.
   */
  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching records');
    }
  }

  /**
   * Retrieves a single entity of type T from the repository by its ID.
   * @param id the ID of the entity to be retrieved.
   * @throws InternalServerErrorException if an unexpected error occurs.
   * @throws NotFoundException if the entity with the given ID is not found.
   */
  async findOne(id: string): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const options: FindOneOptions<T> = { where: { id: Equal(id) } as any };
      const entity = await this.repository.findOne(options);

      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error finding the record');
    }
  }

  /**
   * Removes an entity of type T from the repository by its ID.
   * @param id the ID of the entity to be removed.
   * @throws InternalServerErrorException if an unexpected error occurs.
   * @throws NotFoundException if the entity with the given ID is not found.
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error removing the record');
    }
  }
}
