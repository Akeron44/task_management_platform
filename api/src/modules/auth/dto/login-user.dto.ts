import { IsEmail, IsString, MinLength } from 'class-validator';
import { error_messages } from 'src/common/constants/error-messages';

export class LoginUserDto {
  @IsEmail({}, { message: error_messages.INVALID_EMAIL })
  email: string;

  @IsString()
  @MinLength(8, { message: error_messages.MIN_CHARACTERS('Password', 8) })
  password: string;
}
