import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockUser = { id: '1', name: 'Test User' };
  const mockRequest = {
    user: mockUser,
  } as unknown as Request;

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    hardDelete: jest.fn(),
    getTaskStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: new Date(),
    };

    it('should create a task', async () => {
      const expectedResult = { id: '1', ...createTaskDto };
      mockTaskService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTaskDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.create).toHaveBeenCalledWith(createTaskDto, mockUser.id);
    });
  });

  describe('findAll', () => {
    it('should return all tasks with default parameters', async () => {
      const expectedResult = [{ id: '1', title: 'Task 1' }];
      mockTaskService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(
        mockRequest,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        '0',
        '10',
        'false'
      );

      expect(result).toEqual(expectedResult);
      expect(taskService.findAll).toHaveBeenCalledWith({
        priorities: undefined,
        statuses: undefined,
        dueDateRange: undefined,
        sortBy: undefined,
        sort: undefined,
        skip: 0,
        take: 10,
        userId: mockUser.id,
        myTasks: false,
      });
    });

    it('should handle array of priorities and statuses', async () => {
      const expectedResult = [{ id: '1', title: 'Task 1' }];
      mockTaskService.findAll.mockResolvedValue(expectedResult);

      await controller.findAll(
        mockRequest,
        ['HIGH', 'MEDIUM'],
        ['PENDING', 'IN_PROGRESS'],
        '2024-01-01',
        '2024-12-31',
        'priority',
        'asc',
        '0',
        '10',
        'true'
      );

      expect(taskService.findAll).toHaveBeenCalledWith({
        priorities: ['HIGH', 'MEDIUM'],
        statuses: ['PENDING', 'IN_PROGRESS'],
        dueDateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        sortBy: 'priority',
        sort: 'asc',
        skip: 0,
        take: 10,
        userId: mockUser.id,
        myTasks: true,
      });
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      const expectedStats = {
        total: 10,
        byPriority: { HIGH: 3, MEDIUM: 4, LOW: 3 },
        byStatus: { PENDING: 4, IN_PROGRESS: 3, COMPLETED: 2, CANCELLED: 1 },
      };
      mockTaskService.getTaskStats.mockResolvedValue(expectedStats);

      const result = await controller.getStats(
        mockRequest,
        ['HIGH'],
        ['PENDING'],
        '2024-01-01',
        '2024-12-31',
        'true'
      );

      expect(result).toEqual(expectedStats);
      expect(taskService.getTaskStats).toHaveBeenCalledWith({
        priorities: ['HIGH'],
        statuses: ['PENDING'],
        dueDateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        userId: mockUser.id,
        myTasks: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const expectedResult = { id: '1', title: 'Task 1' };
      mockTaskService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1', mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.findOne).toHaveBeenCalledWith('1', mockUser.id);
    });
  });

  describe('update', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'COMPLETED',
      dueDate: new Date(),
    };

    it('should update a task', async () => {
      const expectedResult = { id: '1', ...updateTaskDto };
      mockTaskService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateTaskDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.update).toHaveBeenCalledWith('1', mockUser.id, updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const expectedResult = { success: true };
      mockTaskService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1', mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.remove).toHaveBeenCalledWith('1', mockUser.id);
    });
  });

  describe('restore', () => {
    it('should restore a task', async () => {
      const expectedResult = { success: true };
      mockTaskService.restore.mockResolvedValue(expectedResult);

      const result = await controller.restore('1', mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.restore).toHaveBeenCalledWith('1', mockUser.id);
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete a task', async () => {
      const expectedResult = { success: true };
      mockTaskService.hardDelete.mockResolvedValue(expectedResult);

      const result = await controller.hardDelete('1', mockRequest);

      expect(result).toEqual(expectedResult);
      expect(taskService.hardDelete).toHaveBeenCalledWith('1', mockUser.id);
    });
  });
});
