import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';
import { UnauthorizedException } from '@nestjs/common';
import { error_messages } from '../../../common/constants/error-messages';

describe('AuthHelper', () => {
  let helper: AuthHelper;
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthHelper,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    helper = module.get<AuthHelper>(AuthHelper);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handlePasswordVerification', () => {
    it('should successfully verify matching passwords', async () => {
      // First generate a hashed password to test with
      const password = 'testPassword123';
      const hashedPassword = await helper.generateHashedPassword(password);

      // Verify the password
      await expect(
        helper.handlePasswordVerification(hashedPassword, password)
      ).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException for non-matching passwords', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await helper.generateHashedPassword(password);

      await expect(
        helper.handlePasswordVerification(hashedPassword, wrongPassword)
      ).rejects.toThrow(new UnauthorizedException(error_messages.INVALID_CREDENTAILS));
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const userData = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
      };
      const mockToken = 'mock.jwt.token';
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await helper.generateToken(userData);

      expect(result).toBe(mockToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(userData);
    });
  });

  describe('generateHashedPassword', () => {
    it('should generate a hashed password with salt', async () => {
      const password = 'testPassword123';

      const hashedPassword = await helper.generateHashedPassword(password);

      // Check if the hashed password contains a salt and hash separated by a dot
      expect(hashedPassword).toContain('.');
      const [salt, hash] = hashedPassword.split('.');
      
      // Verify salt and hash exist and are hex strings
      expect(salt).toBeTruthy();
      expect(hash).toBeTruthy();
      expect(salt).toMatch(/^[0-9a-f]+$/);
      expect(hash).toMatch(/^[0-9a-f]+$/);
      
      // Verify length (8 bytes salt = 16 hex chars, 32 bytes hash = 64 hex chars)
      expect(salt.length).toBe(16);
      expect(hash.length).toBe(64);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';

      const hash1 = await helper.generateHashedPassword(password);
      const hash2 = await helper.generateHashedPassword(password);

      // Should be different due to different random salts
      expect(hash1).not.toBe(hash2);
    });
  });
});