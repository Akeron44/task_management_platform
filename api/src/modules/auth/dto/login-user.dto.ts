import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { error_messages } from '../../../common/constants/error-messages';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: error_messages.INVALID_EMAIL })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: error_messages.MIN_CHARACTERS('Password', 8) })
  password: string;
}
