import { Injectable } from '@nestjs/common';
import { TaskStatusAnalyticsDetailedDto } from './dto/task-status-analytics-detailed.dto';
import { TaskStatus } from '@app/common/enums/task-status.enum';
import { Task } from '@app/tasks/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from '@app/users/entities/user.entity';
import { UserEfficiencyAnalyticsDto } from './dto/user-efficiency-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Retrieves detailed analytics of task statuses.
   *
   * This method calculates the total number of tasks, the number of active,
   * completed, and overdue tasks. It also computes the percentage of each
   * status type relative to the total number of tasks. The counts are retrieved
   * concurrently for efficiency.
   *
   * @returns A Promise that resolves to a TaskStatusAnalyticsDetailedDto object
   *          containing counts and percentages of each task status.
   */

  async getTaskStatusAnalytics(): Promise<TaskStatusAnalyticsDetailedDto> {
    // Get today's date to compare due dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get task counts concurrently for better efficiency
    const [activeTasksCount, completedTasksCount, totalTasksCount] = await Promise.all([
      this.tasksRepository.count({ where: { status: TaskStatus.ACTIVA } }),
      this.tasksRepository.count({ where: { status: TaskStatus.TERMINADA } }),
      this.tasksRepository.count(),
    ]);

    // Calculate overdue tasks: Active tasks whose due date is before today
    const overdueTasksCount = await this.tasksRepository.count({
      where: {
        status: TaskStatus.ACTIVA,
        dueDate: LessThan(today),
      },
    });

    // Calculate percentages, handling the zero-tasks case to avoid division by zero
    const activeTasksPercentage = totalTasksCount > 0 ? (activeTasksCount / totalTasksCount) * 100 : 0;
    const completedTasksPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
    const overdueTasksPercentage = totalTasksCount > 0 ? (overdueTasksCount / totalTasksCount) * 100 : 0;

    return {
      activeTasksCount,
      activeTasksPercentage: parseFloat(activeTasksPercentage.toFixed(2)),
      completedTasksCount,
      completedTasksPercentage: parseFloat(completedTasksPercentage.toFixed(2)),
      overdueTasksCount,
      overdueTasksPercentage: parseFloat(overdueTasksPercentage.toFixed(2)),
      totalTasksCount,
    };

    return {
      activeTasksCount,
      activeTasksPercentage: parseFloat(activeTasksPercentage.toFixed(2)),
      completedTasksCount,
      completedTasksPercentage: parseFloat(completedTasksPercentage.toFixed(2)),
      overdueTasksCount,
      overdueTasksPercentage: parseFloat(overdueTasksPercentage.toFixed(2)),
      totalTasksCount,
    };
  }

  async getUserEfficiencyAnalytics(): Promise<UserEfficiencyAnalyticsDto[]> {
    // Eagerly load all users with their assigned tasks.
    const usersWithTasks = await this.usersRepository.find({
      relations: ['tasks'],
    });

    return usersWithTasks.map((user) => {
      // Filter tasks to get only the completed ones
      const completedTasks = user.tasks.filter((task) => task.status === TaskStatus.TERMINADA);

      // Separate completed tasks into on-time and overdue
      const onTimeCompletedTasks = completedTasks.filter((task) => {
        if (!task.completionDate) return false;
        const completionDay = new Date(task.completionDate);
        const dueDay = new Date(task.dueDate);
        completionDay.setHours(0, 0, 0, 0);
        dueDay.setHours(0, 0, 0, 0);
        return completionDay <= dueDay;
      });

      const overdueCompletedTasks = completedTasks.filter((task) => {
        if (!task.completionDate) return false;
        const completionDay = new Date(task.completionDate);
        const dueDay = new Date(task.dueDate);
        completionDay.setHours(0, 0, 0, 0);
        dueDay.setHours(0, 0, 0, 0);
        return completionDay > dueDay;
      });

      return {
        userId: user.id,
        userName: user.name,
        assignedTasksCount: user.tasks.length,
        completedTasksCount: completedTasks.length,
        onTimeCompletedTasksCount: onTimeCompletedTasks.length,
        overdueCompletedTasksCount: overdueCompletedTasks.length,
      };
    });
  }
}
