import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsDate,
  IsNotEmpty,
  MinDate,
} from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';
import { error_messages } from '../../../common/constants/error-messages';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: error_messages.MIN_CHARACTERS('title', 3) })
  @MaxLength(50, { message: error_messages.MAX_CHARACTERS('title', 50) })
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5, { message: error_messages.MIN_CHARACTERS('title', 5) })
  @MaxLength(255, { message: error_messages.MAX_CHARACTERS('title', 255) })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Priority, {
    message: error_messages.INVALID_PROPERTY,
  })
  priority: Priority;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TaskStatus, {
    message: error_messages.INVALID_PROPERTY,
  })
  status: TaskStatus;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Due date must be today or a future date',
  })
  dueDate: Date;
}
