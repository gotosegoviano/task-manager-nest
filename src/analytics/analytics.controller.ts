import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TaskStatusAnalyticsDetailedDto } from './dto/task-status-analytics-detailed.dto';
import { UserEfficiencyAnalyticsDto } from './dto/user-efficiency-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('tasks/status')
  /**
   * Gets detailed analytics about the current status of all tasks.
   * @returns Promise that resolves to an object containing:
   * - activeTasksCount: The number of active tasks.
   * - activeTasksPercentage: The percentage of active tasks.
   * - completedTasksCount: The number of completed tasks.
   * - completedTasksPercentage: The percentage of completed tasks.
   * - overdueTasksCount: The number of overdue tasks.
   * - overdueTasksPercentage: The percentage of overdue tasks.
   * - totalTasksCount: The total number of tasks.
   */
  getTaskStatusAnalytics(): Promise<TaskStatusAnalyticsDetailedDto> {
    return this.analyticsService.getTaskStatusAnalytics();
  }

  @Get('users/efficiency')
  /**
   * Gets the efficiency of all users.
   * @returns Promise that resolves to an array of objects, each containing:
   * - userId: The ID of the user.
   * - userName: The name of the user.
   * - assignedTasksCount: The number of tasks assigned to the user.
   * - completedTasksCount: The number of tasks completed by the user.
   * - onTimeCompletedTasksCount: The number of tasks completed on time by the user.
   * - overdueCompletedTasksCount: The number of tasks completed after the due date by the user.
   */
  getUserEfficiencyAnalytics(): Promise<UserEfficiencyAnalyticsDto[]> {
    return this.analyticsService.getUserEfficiencyAnalytics();
  }
}
