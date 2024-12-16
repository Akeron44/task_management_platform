import { ApiProperty } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { MinLength, MaxLength, IsString, IsEnum, IsDate, MinDate, IsOptional } from 'class-validator';
import { error_messages } from '../../../common/constants/error-messages';


  export class UpdateTaskDto {
    @ApiProperty()
    @IsOptional()
    @MinLength(3, { message: error_messages.MIN_CHARACTERS('title', 3) })
    @MaxLength(50, { message: error_messages.MAX_CHARACTERS('title', 50) })
    @IsString()
    title: string;
  
    @ApiProperty()
    @IsOptional()
    @MinLength(5, { message: error_messages.MIN_CHARACTERS('title', 5) })
    @MaxLength(255, { message: error_messages.MAX_CHARACTERS('title', 255) })
    @IsString()
    description: string;
  
    @ApiProperty()
    @IsOptional()
    @IsEnum(Priority, {
      message: error_messages.INVALID_PROPERTY,
    })
    priority: Priority;
  
    @ApiProperty()
    @IsOptional()
    @IsEnum(TaskStatus, {
      message: error_messages.INVALID_PROPERTY,
    })
    status: TaskStatus;
  
    @ApiProperty()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Due date must be today or a future date',
    })
    dueDate: Date;
  }
  