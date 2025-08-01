import { TaskStatus } from '../../common/enums/task-status.enum';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  estimatedHours: number;

  @Column('date')
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ACTIVA,
  })
  status: TaskStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  monetaryCost: number;

  @ManyToMany(() => User, (user) => user.tasks, {
    cascade: true, // This means task operations will affect assigned users.
  })
  @JoinTable()
  assignedUsers: User[];
}
