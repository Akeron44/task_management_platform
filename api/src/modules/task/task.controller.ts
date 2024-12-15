import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Request } from 'express';
import { controller_path } from '../../common/constants/controller-path';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags(controller_path.TASKS.INDEX)
@ApiBearerAuth('JWT-auth')
@Controller(controller_path.TASKS.INDEX)
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' }) 
  @ApiBody({ type: CreateTaskDto }) 
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return this.taskService.create(createTaskDto, req.user['id']);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch tasks' }) 
  @ApiQuery({
    name: 'priority',
    required: false,
    description: 'Filter by task priority. Can be one of: HIGH, MEDIUM, LOW',
    isArray: true, 
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status. Can be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
    isArray: true, 
  })
  @ApiQuery({
    name: 'dueDateStart',
    required: false,
    description: 'Start date for filtering tasks by due date. Format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'dueDateEnd',
    required: false,
    description: 'End date for filtering tasks by due date. Format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort tasks by the given field. Can be one of: priority, status, dueDate, none',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sorting order. Can be: asc or desc',
    default: 'none'
  })
  @ApiQuery({
    name: 'skip',
    required: true,
    description: 'Pagination: number of tasks to skip',
    default: 0
  })
  @ApiQuery({
    name: 'take',
    required: true,
    description: 'Pagination: number of tasks to return',
    default: 10
  })
  @ApiQuery({
    name: 'myTasks',
    required: true,
    description: 'Filter to only show tasks belonging to the logged-in user. true/false',
    default: false
  })
  async findAll(
    @Req() req: Request,
    @Query('priority')
    priority?: ('HIGH' | 'MEDIUM' | 'LOW')[] | 'HIGH' | 'MEDIUM' | 'LOW',
    @Query('status')
    status?:
      | ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')[]
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED',
    @Query('dueDateStart') dueDateStart?: string,
    @Query('dueDateEnd') dueDateEnd?: string,
    @Query('sortBy') sortBy?: 'priority' | 'status' | 'dueDate' | 'none',
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('myTasks') myTasks?: string,
  ) {
    const priorities = priority
      ? Array.isArray(priority)
        ? priority
        : [priority]
      : undefined;
    const statuses = status
      ? Array.isArray(status)
        ? status
        : [status]
      : undefined;

    return this.taskService.findAll({
      priorities,
      statuses,
      dueDateRange:
        dueDateStart || dueDateEnd
          ? {
              start: dueDateStart ? new Date(dueDateStart) : undefined,
              end: dueDateEnd ? new Date(dueDateEnd) : undefined,
            }
          : undefined,
      sortBy,
      sort,
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      userId: req.user['id'],
      myTasks: myTasks === 'true',
    });
  }

  @Get(controller_path.TASKS.STATISTICS)
  @ApiOperation({ summary: 'Fetch tasks statistics' }) 
  @ApiQuery({
    name: 'priority',
    required: false,
    description: 'Filter by task priority. Can be one of: HIGH, MEDIUM, LOW',
    isArray: true, 
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status. Can be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
    isArray: true, 
  })
  @ApiQuery({
    name: 'dueDateStart',
    required: false,
    description: 'Start date for filtering tasks by due date. Format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'dueDateEnd',
    required: false,
    description: 'End date for filtering tasks by due date. Format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'myTasks',
    required: true,
    description: 'Filter to only show tasks belonging to the logged-in user. true/false',
    default: false
  })
  getStats(
    @Req() req: Request,
    @Query('priority')
    priority?: ('HIGH' | 'MEDIUM' | 'LOW')[] | 'HIGH' | 'MEDIUM' | 'LOW',
    @Query('status')
    status?:
      | ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED')[]
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED',
    @Query('dueDateStart') dueDateStart?: string,
    @Query('dueDateEnd') dueDateEnd?: string,
    @Query('myTasks') myTasks?: string,
  ) {
    const priorities = priority
      ? Array.isArray(priority)
        ? priority
        : [priority]
      : undefined;
    const statuses = status
      ? Array.isArray(status)
        ? status
        : [status]
      : undefined;
    return this.taskService.getTaskStats({
      priorities,
      statuses,
      dueDateRange:
        dueDateStart || dueDateEnd
          ? {
              start: dueDateStart ? new Date(dueDateStart) : undefined,
              end: dueDateEnd ? new Date(dueDateEnd) : undefined,
            }
          : undefined,
      userId: req.user['id'],
      myTasks: myTasks === 'true',
    });
  }

  @Get(controller_path.TASKS.TASK_ID)
  @ApiOperation({ summary: 'Fetch a single task' }) 
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.taskService.findOne(id, req.user['id']);
  }

  @Patch(controller_path.TASKS.TASK_ID)
  @ApiOperation({ summary: 'Update a task' }) 
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return this.taskService.update(id, req.user['id'], updateTaskDto);
  }

  @Delete(controller_path.TASKS.TASK_ID)
  @ApiOperation({ summary: 'Soft delete a task' }) 
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.taskService.remove(id, req.user['id']);
  }

  @Patch(controller_path.TASKS.RESTORE)
  @ApiOperation({ summary: 'Restore a soft deleted task' }) 
  restore(@Param('id') id: string, @Req() req: Request) {
    return this.taskService.restore(id, req.user['id']);
  }

  @Delete(controller_path.TASKS.HARD_DELETE)
  @ApiOperation({ summary: 'Hard delete a task' }) 
  hardDelete(@Param('id') id: string, @Req() req: Request) {
    return this.taskService.hardDelete(id, req.user['id']);
  }
}
