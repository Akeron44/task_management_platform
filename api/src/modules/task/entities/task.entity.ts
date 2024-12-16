import { Priority, TaskStatus } from '@prisma/client';

export class Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: string;
}
