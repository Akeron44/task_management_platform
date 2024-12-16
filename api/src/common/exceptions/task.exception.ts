import { HttpException, HttpStatus } from '@nestjs/common';
import { error_messages } from '../constants/error-messages';

export class TaskNotFoundException extends HttpException {
  constructor(id: string) {
    super(error_messages.TASK_NOT_FOUND(`${id}`), HttpStatus.NOT_FOUND);
  }
}

export class TaskUnauthorizedException extends HttpException {
  constructor() {
    super(error_messages.UNAUTHORIZED, HttpStatus.FORBIDDEN);
  }
}

export class TaskAlreadyDeletedException extends HttpException {
  constructor(id: string) {
    super(error_messages.TASK_ALREADY_DELETED(`${id}`), HttpStatus.BAD_REQUEST);
  }
}
