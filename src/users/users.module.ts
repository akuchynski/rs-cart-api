import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { DbModule } from '../db/db.module';
import { UserController } from './user.controller';

@Module({
  imports: [DbModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
