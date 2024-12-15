import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { error_messages } from 'src/common/constants/error-messages';
import { UserDal } from 'src/modules/user/dal/user.dal';

interface TokenPayload {
  id: number;
  name: string;
  age: number;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userDal: UserDal,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userDal.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException(error_messages.UNAUTHORIZED);
    }

    return user;
  }
}
