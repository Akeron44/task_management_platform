import { Test, TestingModule } from '@nestjs/testing';
import { TaskDal } from './task.dal';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorDal } from '../../../common/dal/error.dal';
import { Task, Priority, TaskStatus, Prisma } from '@prisma/client';
import { TaskNotFoundException, TaskAlreadyDeletedException } from '../../../common/exceptions/task.exception';

describe('TaskDal', () => {
  let dal: TaskDal;
  let prismaService: PrismaService;
  let errorDal: ErrorDal;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: Priority.HIGH,
    status: TaskStatus.PENDING,
    dueDate: new Date(),
    userId: '1',
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockErrorDal = {
    handleError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskDal,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ErrorDal,
          useValue: mockErrorDal,
        },
      ],
    }).compile();

    dal = module.get<TaskDal>(TaskDal);
    prismaService = module.get<PrismaService>(PrismaService);
    errorDal = module.get<ErrorDal>(ErrorDal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTaskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: Priority.HIGH,
      status: TaskStatus.PENDING,
      dueDate: new Date(),
      user: { connect: { id: '1' } },
    };

    it('should create a task', async () => {
      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await dal.create(createTaskData);

      expect(result).toEqual(mockTask);
      expect(prismaService.task.create).toHaveBeenCalledWith({ data: createTaskData });
    });

    it('should handle errors through errorDal', async () => {
      const error = new Error('Database error');
      mockPrismaService.task.create.mockRejectedValue(error);

      await dal.create(createTaskData);

      expect(errorDal.handleError).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    const findAllParams = {
      skip: 0,
      take: 10,
      where: { userId: '1' },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    };

    it('should return tasks array', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);

      const result = await dal.findAll(findAllParams);

      expect(result).toEqual([mockTask]);
      expect(prismaService.task.findMany).toHaveBeenCalledWith(findAllParams);
    });
  });

  describe('countAll', () => {
    it('should return task count', async () => {
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await dal.countAll({ userId: '1' });

      expect(result).toBe(1);
      expect(prismaService.task.count).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);

      const result = await dal.findOne({ id: '1' });

      expect(result).toEqual(mockTask);
      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: '1', deletedAt: null },
      });
    });

    it('should return null if task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await dal.findOne({ id: '1' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateData = {
      title: 'Updated Task',
      status: TaskStatus.COMPLETED,
    };

    it('should update a task', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue({ ...mockTask, ...updateData });

      const result = await dal.update({
        where: { id: '1' },
        data: updateData,
      });

      expect(result).toEqual({ ...mockTask, ...updateData });
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('should handle TaskNotFoundException through errorDal', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await dal.update({ where: { id: '1' }, data: updateData });

      expect(result).toBeUndefined();
      expect(errorDal.handleError).toHaveBeenCalledWith(
        new TaskNotFoundException('1')
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete a task', async () => {
      const deletedTask = { ...mockTask, deletedAt: new Date() };
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue(deletedTask);

      const result = await dal.softDelete({ id: '1' });

      expect(result).toEqual(deletedTask);
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should handle TaskNotFoundException through errorDal', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await dal.softDelete({ id: '1' });

      expect(result).toBeUndefined();
      expect(errorDal.handleError).toHaveBeenCalledWith(
        new TaskNotFoundException('1')
      );
    });

    it('should handle TaskAlreadyDeletedException through errorDal', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue({ ...mockTask, deletedAt: new Date() });

      const result = await dal.softDelete({ id: '1' });

      expect(result).toBeUndefined();
      expect(errorDal.handleError).toHaveBeenCalledWith(
        new TaskAlreadyDeletedException('1')
      );
    });
  });

  describe('restore', () => {
    it('should restore a deleted task', async () => {
      const deletedTask = { ...mockTask, deletedAt: new Date() };
      mockPrismaService.task.findFirst.mockResolvedValue(deletedTask);
      mockPrismaService.task.update.mockResolvedValue(mockTask);

      const result = await dal.restore({ id: '1' });

      expect(result).toEqual(mockTask);
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: null },
      });
    });

    it('should handle error through errorDal if deleted task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);
      
      const result = await dal.restore({ id: '1' });

      expect(result).toBeUndefined();
      expect(errorDal.handleError).toHaveBeenCalledWith(
        new Error('Deleted task not found')
      );
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete a task', async () => {
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await dal.hardDelete({ id: '1' });

      expect(result).toEqual(mockTask);
      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});