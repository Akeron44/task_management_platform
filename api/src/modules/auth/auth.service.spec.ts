import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthHelper } from './helpers/auth.helper';
import { UserDal } from '../user/dal/user.dal';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { error_messages } from '../../common/constants/error-messages';

describe('AuthService', () => {
  let service: AuthService;
  let authHelper: AuthHelper;
  let userDal: UserDal;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    age: 25,
  };

  const mockToken = 'mock.jwt.token';

  const mockAuthHelper = {
    handlePasswordVerification: jest.fn(),
    generateToken: jest.fn(),
    generateHashedPassword: jest.fn(),
  };

  const mockUserDal = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthHelper,
          useValue: mockAuthHelper,
        },
        {
          provide: UserDal,
          useValue: mockUserDal,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authHelper = module.get<AuthHelper>(AuthHelper);
    userDal = module.get<UserDal>(UserDal);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user', async () => {
      mockUserDal.findByEmail.mockResolvedValue(mockUser);
      mockAuthHelper.handlePasswordVerification.mockResolvedValue(undefined);
      mockAuthHelper.generateToken.mockResolvedValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age,
        token: mockToken,
      });
      expect(userDal.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(authHelper.handlePasswordVerification).toHaveBeenCalledWith(
        mockUser.password,
        loginDto.password,
      );
      expect(authHelper.generateToken).toHaveBeenCalledWith({
        id: parseInt(mockUser.id),
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserDal.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(error_messages.INVALID_CREDENTAILS),
      );
      expect(userDal.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException if password verification fails', async () => {
      mockUserDal.findByEmail.mockResolvedValue(mockUser);
      mockAuthHelper.handlePasswordVerification.mockRejectedValue(
        new UnauthorizedException(error_messages.INVALID_CREDENTAILS),
      );

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(error_messages.INVALID_CREDENTAILS),
      );
    });
  });

  describe('signup', () => {
    const signupDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
    };

    it('should successfully create a new user', async () => {
      mockUserDal.findByEmail.mockResolvedValue(null);
      mockAuthHelper.generateHashedPassword.mockResolvedValue('hashedPassword');
      mockUserDal.createUser.mockResolvedValue(mockUser);
      mockAuthHelper.generateToken.mockResolvedValue(mockToken);

      const result = await service.signup(signupDto);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age,
        token: mockToken,
      });
      expect(userDal.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(authHelper.generateHashedPassword).toHaveBeenCalledWith(signupDto.password);
      expect(userDal.createUser).toHaveBeenCalledWith({
        ...signupDto,
        password: 'hashedPassword',
      });
    });

    it('should throw UnprocessableEntityException if email already exists', async () => {
      mockUserDal.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        new UnprocessableEntityException(error_messages.EMAIL_IN_USE),
      );
      expect(userDal.findByEmail).toHaveBeenCalledWith(signupDto.email);
    });
  });
});
