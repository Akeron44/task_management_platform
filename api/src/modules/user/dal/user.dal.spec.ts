import { Test, TestingModule } from '@nestjs/testing';
import { UserDal } from './user.dal';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorDal } from '../../../common/dal/error.dal';
import { SignupUserDto } from '../../../modules/auth/dto/signup-user.dto';
import { User } from '@prisma/client';

describe('UserDal', () => {
  let dal: UserDal;
  let prismaService: PrismaService;
  let errorDal: ErrorDal;

  // Mock user data
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  // Mock signup DTO
  const mockSignupDto: SignupUserDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    age: 25,
  };

  // Mock services
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockErrorDal = {
    handleError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDal,
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

    dal = module.get<UserDal>(UserDal);
    prismaService = module.get<PrismaService>(PrismaService);
    errorDal = module.get<ErrorDal>(ErrorDal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await dal.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await dal.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });

    it('should handle errors through errorDal', async () => {
      const error = new Error('Database error');
      mockPrismaService.user.findUnique.mockRejectedValue(error);

      await dal.findByEmail('test@example.com');

      expect(errorDal.handleError).toHaveBeenCalledWith(error);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await dal.createUser(mockSignupDto);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: mockSignupDto,
      });
    });

    it('should handle errors through errorDal', async () => {
      const error = new Error('Database error');
      mockPrismaService.user.create.mockRejectedValue(error);

      await dal.createUser(mockSignupDto);

      expect(errorDal.handleError).toHaveBeenCalledWith(error);
    });
  });
});