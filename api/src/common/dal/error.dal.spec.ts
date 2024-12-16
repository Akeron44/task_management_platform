import { Test, TestingModule } from '@nestjs/testing';
import { ErrorDal } from './error.dal';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { error_messages } from '../constants/error-messages';

describe('ErrorDal', () => {
  let service: ErrorDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorDal],
    }).compile();

    service = module.get<ErrorDal>(ErrorDal);
  });

  describe('handleError', () => {
    it('should throw InternalServerErrorException for non-Prisma errors', () => {
      const error = new Error('Generic error');
      
      expect(() => service.handleError(error)).toThrow(InternalServerErrorException);
      expect(() => service.handleError(error)).toThrow(error.message);
    });

    describe('Prisma Database Connection Errors', () => {
      ['P1000', 'P1001', 'P1002', 'P1003'].forEach(code => {
        it(`should throw InternalServerErrorException for Prisma error ${code}`, () => {
          const prismaError = new PrismaClientKnownRequestError(
            'Database error',
            { code, clientVersion: '4.7.1' }
          );

          expect(() => service.handleError(prismaError)).toThrow(InternalServerErrorException);
          expect(() => service.handleError(prismaError)).toThrow(
            error_messages.PRISMA.DATABASE_ERROR
          );
        });
      });
    });

    describe('Prisma Not Found Errors', () => {
      it('should throw NotFoundException for P1010', () => {
        const prismaError = new PrismaClientKnownRequestError(
          'Not found',
          { code: 'P1010', clientVersion: '4.7.1' }
        );

        expect(() => service.handleError(prismaError)).toThrow(NotFoundException);
        expect(() => service.handleError(prismaError)).toThrow(
          error_messages.PRISMA.NOT_FOUND
        );
      });

      it('should throw NotFoundException for P2025', () => {
        const prismaError = new PrismaClientKnownRequestError(
          'Record not found',
          { code: 'P2025', clientVersion: '4.7.1' }
        );

        expect(() => service.handleError(prismaError)).toThrow(NotFoundException);
        expect(() => service.handleError(prismaError)).toThrow(
          error_messages.PRISMA.RECORD_NOT_UPDATE_OR_DELETE
        );
      });
    });

    describe('Prisma Constraint Violation Errors', () => {
      it('should throw ConflictException for P2002', () => {
        const prismaError = new PrismaClientKnownRequestError(
          'Unique constraint violation',
          { code: 'P2002', clientVersion: '4.7.1' }
        );

        expect(() => service.handleError(prismaError)).toThrow(ConflictException);
        expect(() => service.handleError(prismaError)).toThrow(
          error_messages.PRISMA.CONSTRAINT_VIOLATION
        );
      });

      ['P2026', 'P2003'].forEach(code => {
        it(`should throw ConflictException for ${code}`, () => {
          const prismaError = new PrismaClientKnownRequestError(
            'Foreign key violation',
            { code, clientVersion: '4.7.1' }
          );

          expect(() => service.handleError(prismaError)).toThrow(ConflictException);
          expect(() => service.handleError(prismaError)).toThrow(
            error_messages.PRISMA.FOREIGN_KEY_VIOLATION
          );
        });
      });
    });

    it('should throw InternalServerErrorException for P2024', () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Invalid field',
        { code: 'P2024', clientVersion: '4.7.1' }
      );

      expect(() => service.handleError(prismaError)).toThrow(InternalServerErrorException);
      expect(() => service.handleError(prismaError)).toThrow(
        error_messages.PRISMA.INVALID_FIELD
      );
    });

    it('should throw InternalServerErrorException for unknown Prisma error codes', () => {
      const prismaError = new PrismaClientKnownRequestError(
        'Unknown error',
        { code: 'P9999', clientVersion: '4.7.1' }
      );

      expect(() => service.handleError(prismaError)).toThrow(InternalServerErrorException);
      expect(() => service.handleError(prismaError)).toThrow(
        error_messages.PRISMA.UNKNOWN_DATABASE_ERROR
      );
    });
  });
});