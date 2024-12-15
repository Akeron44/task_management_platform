import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ErrorDal } from 'src/common/dal/error.dal';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, ErrorDal],
})
export class UserModule {}
