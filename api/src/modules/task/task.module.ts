import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskDal } from './dal/task.dal';
import { PrismaModule } from '../prisma/prisma.module';
import { ErrorDal } from 'src/common/dal/error.dal';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskService, TaskDal, ErrorDal],
  exports: [TaskService],
})
export class TaskModule {}
