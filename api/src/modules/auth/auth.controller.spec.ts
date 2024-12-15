import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      age: 25
    };

    const mockSignupResponse = {
      id: 1,
      email: 'test@example.com',
      accessToken: 'mock-token',
    };

    it('should signup a new user successfully', async () => {
      mockAuthService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(mockSignupResponse);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(authService.signup).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if signup fails', async () => {
      const error = new Error('Signup failed');
      mockAuthService.signup.mockRejectedValue(error);

      await expect(controller.signup(signupDto)).rejects.toThrow(error);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    const loginDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockLoginResponse = {
      accessToken: 'mock-token',
      user: {
        id: 1,
        email: 'test@example.com',
      },
    };

    it('should login user successfully', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if login fails', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
