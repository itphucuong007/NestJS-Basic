import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';

// Đọc tài liệu: https://docs.nestjs.com/recipes/passport
@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})

export class AuthModule {}
