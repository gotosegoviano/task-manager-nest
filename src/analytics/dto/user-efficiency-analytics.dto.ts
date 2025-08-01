export class UserEfficiencyAnalyticsDto {
  userId: string;
  userName: string;
  assignedTasksCount: number;
  completedTasksCount: number;
  onTimeCompletedTasksCount: number;
  overdueCompletedTasksCount: number;
}
