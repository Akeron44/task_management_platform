import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDal } from './dal/task.dal';
import {
  TaskNotFoundException,
  TaskUnauthorizedException,
} from '../../common/exceptions/task.exception';
import { Priority, Prisma, TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly taskDal: TaskDal) {}

  create(createTaskDto: CreateTaskDto, userId: string) {
    return this.taskDal.create({
      ...createTaskDto,
      user: {
        connect: { id: userId },
      },
    });
  }

  async findAll(params: {
    priorities?: ('HIGH' | 'MEDIUM' | 'LOW')[];
    statuses?: ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')[];
    dueDateRange?: {
      start?: Date;
      end?: Date;
    };
    sortBy?: 'priority' | 'status' | 'dueDate' | 'none';
    sort?: 'asc' | 'desc';
    skip?: number;
    take?: number;
    userId: string;
    myTasks: boolean;
  }) {
    const {
      priorities,
      statuses,
      dueDateRange,
      sortBy,
      sort,
      skip,
      take,
      userId,
      myTasks,
    } = params;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      ...(priorities && { priority: { in: priorities } }),
      ...(statuses && { status: { in: statuses } }),
      ...(dueDateRange && {
        dueDate: {
          ...(dueDateRange.start && { gte: dueDateRange.start }),
          ...(dueDateRange.end && { lte: dueDateRange.end }),
        },
      }),
      ...(myTasks ? { userId } : { userId: { not: userId } }),
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput =
      sort && sortBy && sortBy !== 'none' ? { [sortBy]: sort } : undefined;

    const tasks = await this.taskDal.findAll({
      where,
      orderBy,
      skip,
      take,
    });

    const total = await this.taskDal.countAll(where);

    return { tasks: tasks, total: total };
  }

  async getTaskStats(params: {
    priorities?: ('HIGH' | 'MEDIUM' | 'LOW')[];
    statuses?: ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')[];
    dueDateRange?: {
      start?: Date;
      end?: Date;
    };
    userId: string;
    myTasks: boolean;
  }) {
    const { priorities, statuses, dueDateRange, userId, myTasks } = params;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      ...(priorities && { priority: { in: priorities } }),
      ...(statuses && { status: { in: statuses } }),
      ...(dueDateRange && {
        dueDate: {
          ...(dueDateRange.start && { gte: dueDateRange.start }),
          ...(dueDateRange.end && { lte: dueDateRange.end }),
        },
      }),
      ...(myTasks ? { userId } : { userId: { not: userId } }),
    };

    const tasks = await this.taskDal.findAll({
      where,
    });

    return {
      total: tasks.length,
      byStatus: {
        [TaskStatus.PENDING]: tasks.filter(
          (t) => t.status === TaskStatus.PENDING,
        ).length,
        [TaskStatus.IN_PROGRESS]: tasks.filter(
          (t) => t.status === TaskStatus.IN_PROGRESS,
        ).length,
        [TaskStatus.COMPLETED]: tasks.filter(
          (t) => t.status === TaskStatus.COMPLETED,
        ).length,
        [TaskStatus.CANCELLED]: tasks.filter(
          (t) => t.status === TaskStatus.CANCELLED,
        ).length,
      },
      byPriority: {
        [Priority.LOW]: tasks.filter((t) => t.priority === Priority.LOW).length,
        [Priority.MEDIUM]: tasks.filter((t) => t.priority === Priority.MEDIUM)
          .length,
        [Priority.HIGH]: tasks.filter((t) => t.priority === Priority.HIGH)
          .length,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.taskDal.findOne({ id });
    if (!task) {
      throw new TaskNotFoundException(id);
    }
    if (task.userId !== userId) {
      throw new TaskUnauthorizedException();
    }
    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    try {
      await this.findOne(id, userId);
      return this.taskDal.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.taskDal.softDelete({ id });
  }

  async restore(id: string, userId: string) {
    // First check if the task belongs to the user
    const task = await this.taskDal.findOne({ id });
    if (task && task.userId !== userId) {
      throw new TaskNotFoundException(id);
    }
    return this.taskDal.restore({ id });
  }

  async hardDelete(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.taskDal.hardDelete({ id });
  }
}
