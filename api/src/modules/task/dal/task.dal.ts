import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';
import {
  TaskNotFoundException,
  TaskAlreadyDeletedException,
} from '../../../common/exceptions/task.exception';
import { ErrorDal } from '../../../common/dal/error.dal';

@Injectable()
export class TaskDal {
  constructor(
    private prisma: PrismaService,
    private errorDal: ErrorDal,
  ) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    try {
      return await this.prisma.task.create({ data });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    try {
      const { skip, take, where, orderBy } = params;
      return await this.prisma.task.findMany({
        ...(typeof skip === 'number' ? { skip } : {}),
        ...(typeof take === 'number' ? { take } : {}),
        where,
        orderBy,
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async countAll(where?: Prisma.TaskWhereInput) {
    try {
      return await this.prisma.task.count({ where: where });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async findOne(where: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    try {
      return await this.prisma.task.findFirst({
        where: {
          ...where,
          deletedAt: null,
        },
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async update(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    try {
      const task = await this.findOne(where);
      if (!task) {
        throw new TaskNotFoundException(where.id as string);
      }
      return this.prisma.task.update({
        data,
        where,
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async softDelete(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    try {
      const task = await this.findOne(where);
      if (!task) {
        throw new TaskNotFoundException(where.id as string);
      }
      if (task.deletedAt) {
        throw new TaskAlreadyDeletedException(where.id as string);
      }
      return this.prisma.task.update({
        where,
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async restore(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          ...where,
          deletedAt: { not: null },
        },
      });
      if (!task) {
        throw new Error('Deleted task not found');
      }
      return this.prisma.task.update({
        where,
        data: {
          deletedAt: null,
        },
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }

  async hardDelete(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    try {
      return await this.prisma.task.delete({
        where,
      });
    } catch (error) {
      this.errorDal.handleError(error);
    }
  }
}
