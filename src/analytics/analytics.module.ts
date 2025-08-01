import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@app/tasks/entities/task.entity';
import { User } from '@app/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
