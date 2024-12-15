import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { controller_path } from '../../common/constants/controller-path';

@Controller(controller_path.AUTH.INDEX)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(controller_path.AUTH.LOG_IN)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post(controller_path.AUTH.SIGN_UP)
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto);
  }
}
