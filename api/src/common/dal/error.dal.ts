import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error_messages } from '../constants/error-messages';

@Injectable()
export class ErrorDal {
  handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      this.handlePrismaError(error);
    } else {
      throw new InternalServerErrorException(error.message);
    }
  }

  private handlePrismaError(error: PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P1000':
      case 'P1001':
      case 'P1002':
      case 'P1003':
        throw new InternalServerErrorException(
          error_messages.PRISMA.DATABASE_ERROR,
        );

      case 'P1010':
        throw new NotFoundException(error_messages.PRISMA.NOT_FOUND);

      case 'P2002':
        throw new ConflictException(error_messages.PRISMA.CONSTRAINT_VIOLATION);

      case 'P2025':
        throw new NotFoundException(
          error_messages.PRISMA.RECORD_NOT_UPDATE_OR_DELETE,
        );

      case 'P2026':
      case 'P2003':
        throw new ConflictException(
          error_messages.PRISMA.FOREIGN_KEY_VIOLATION,
        );

      case 'P2024':
        throw new InternalServerErrorException(
          error_messages.PRISMA.INVALID_FIELD,
        );

      default:
        throw new InternalServerErrorException(
          error_messages.PRISMA.UNKNOWN_DATABASE_ERROR,
        );
    }
  }
}
