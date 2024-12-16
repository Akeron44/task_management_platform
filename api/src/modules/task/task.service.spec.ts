import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskDal } from './dal/task.dal';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority, TaskStatus } from '@prisma/client';
import { TaskNotFoundException, TaskUnauthorizedException } from '../../common/exceptions/task.exception';

describe('TaskService', () => {
  let service: TaskService;
  let taskDal: TaskDal;

  const mockTask = {
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

  const mockTaskDal = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    hardDelete: jest.fn(),
    countAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskDal,
          useValue: mockTaskDal,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskDal = module.get<TaskDal>(TaskDal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      priority: Priority.HIGH,
      status: TaskStatus.PENDING,
      dueDate: new Date(),
    };

    it('should create a task', async () => {
      mockTaskDal.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, '1');

      expect(result).toEqual(mockTask);
      expect(taskDal.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: {
          connect: { id: '1' },
        },
      });
    });
  });

  describe('findAll', () => {
    const mockParams = {
      priorities: [Priority.HIGH],
      statuses: [TaskStatus.PENDING],
      dueDateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      },
      sortBy: 'priority' as const,
      sort: 'asc' as const,
      skip: 0,
      take: 10,
      userId: '1',
      myTasks: true,
    };

    it('should return filtered tasks with total count', async () => {
      const mockTasks = [mockTask];
      mockTaskDal.findAll.mockResolvedValue(mockTasks);
      mockTaskDal.countAll.mockResolvedValue(1);

      const result = await service.findAll(mockParams);

      expect(result).toEqual({ tasks: mockTasks, total: 1 });
      expect(taskDal.findAll).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          priority: { in: [Priority.HIGH] },
          status: { in: [TaskStatus.PENDING] },
          dueDate: {
            gte: mockParams.dueDateRange.start,
            lte: mockParams.dueDateRange.end,
          },
          userId: '1',
        },
        orderBy: { priority: 'asc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getTaskStats', () => {
    const mockParams = {
      priorities: [Priority.HIGH],
      statuses: [TaskStatus.PENDING],
      dueDateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      },
      userId: '1',
      myTasks: true,
    };

    it('should return task statistics', async () => {
      const mockTasks = [
        { ...mockTask, status: TaskStatus.PENDING, priority: Priority.HIGH },
        { ...mockTask, status: TaskStatus.COMPLETED, priority: Priority.MEDIUM },
      ];
      mockTaskDal.findAll.mockResolvedValue(mockTasks);

      const result = await service.getTaskStats(mockParams);

      expect(result).toEqual({
        total: 2,
        byStatus: {
          [TaskStatus.PENDING]: 1,
          [TaskStatus.IN_PROGRESS]: 0,
          [TaskStatus.COMPLETED]: 1,
          [TaskStatus.CANCELLED]: 0,
        },
        byPriority: {
          [Priority.LOW]: 0,
          [Priority.MEDIUM]: 1,
          [Priority.HIGH]: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists and belongs to user', async () => {
      mockTaskDal.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('1', '1');

      expect(result).toEqual(mockTask);
      expect(taskDal.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw TaskNotFoundException if task does not exist', async () => {
      mockTaskDal.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', '1')).rejects.toThrow(TaskNotFoundException);
    });

    it('should throw TaskUnauthorizedException if task belongs to different user', async () => {
      mockTaskDal.findOne.mockResolvedValue({ ...mockTask, userId: '2' });

      await expect(service.findOne('1', '1')).rejects.toThrow(TaskUnauthorizedException);
    });
  });

  describe('update', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      priority: Priority.HIGH,
      status: TaskStatus.COMPLETED,
      dueDate: new Date(),
    };

    it('should update a task', async () => {
      mockTaskDal.findOne.mockResolvedValue(mockTask);
      mockTaskDal.update.mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const result = await service.update('1', '1', updateTaskDto);

      expect(result).toEqual({ ...mockTask, ...updateTaskDto });
      expect(taskDal.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateTaskDto,
      });
    });

    it('should throw error if task not found or unauthorized', async () => {
      mockTaskDal.findOne.mockResolvedValue(null);

      await expect(service.update('1', '1', updateTaskDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should soft delete a task', async () => {
      mockTaskDal.findOne.mockResolvedValue(mockTask);
      mockTaskDal.softDelete.mockResolvedValue({ ...mockTask, deletedAt: new Date() });

      const result = await service.remove('1', '1');

      expect(result).toBeDefined();
      expect(taskDal.softDelete).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted task', async () => {
      mockTaskDal.findOne.mockResolvedValue(mockTask);
      mockTaskDal.restore.mockResolvedValue({ ...mockTask, deletedAt: null });

      const result = await service.restore('1', '1');

      expect(result).toBeDefined();
      expect(taskDal.restore).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw TaskNotFoundException if task belongs to different user', async () => {
      mockTaskDal.findOne.mockResolvedValue({ ...mockTask, userId: '2' });

      await expect(service.restore('1', '1')).rejects.toThrow(TaskNotFoundException);
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete a task', async () => {
      mockTaskDal.findOne.mockResolvedValue(mockTask);
      mockTaskDal.hardDelete.mockResolvedValue({ count: 1 });

      const result = await service.hardDelete('1', '1');

      expect(result).toEqual({ count: 1 });
      expect(taskDal.hardDelete).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
