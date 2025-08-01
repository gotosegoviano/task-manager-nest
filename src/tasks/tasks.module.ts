import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Task } from './entities/task.entity';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
