import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // ✅ 추가

@Module({
  imports: [UserModule],
  providers: [AuthService], // ✅ Strategy 대신 AuthService
  controllers: [AuthController],
})
export class AuthModule {}
