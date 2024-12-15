import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt } from 'crypto';
import { error_messages } from 'src/common/constants/error-messages';
import { promisify } from 'util';

interface UserGenerateToken {
  id: number;
  name: string;
  email: string;
  age: number;
}

@Injectable()
export class AuthHelper {
  constructor(private jwtService: JwtService) {}

  async handlePasswordVerification(
    storedPassword: string,
    providedPassword: string,
  ) {
    const scryptAsync = promisify(scrypt);

    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await scryptAsync(providedPassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException(error_messages.INVALID_CREDENTAILS);
    }
  }

  async generateToken({ id, name, age, email }: UserGenerateToken) {
    return this.jwtService.signAsync({ id, name, age, email });
  }

  async generateHashedPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const scryptAsync = promisify(scrypt);
    const hash = (await scryptAsync(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return result;
  }
}
