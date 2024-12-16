import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from './helpers/auth.helper';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ErrorDal } from 'src/common/dal/error.dal';
import { UserDal } from '../user/dal/user.dal';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserDal,
    AuthHelper,
    JwtStrategy,
    JwtAuthGuard,
    ErrorDal,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
