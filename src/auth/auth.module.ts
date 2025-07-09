import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // ✅ 추가
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key', // 환경변수 사용 권장
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService], // ✅ Strategy 대신 AuthService
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
