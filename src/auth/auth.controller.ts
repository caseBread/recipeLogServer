import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '카카오 로그인 페이지 리다이렉트 URL 반환' })
  @ApiQuery({
    name: 'redirect',
    description: '로그인 완료 후 리디렉트될 URL',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: '카카오 로그인 페이지로 리다이렉트',
  })
  @Get('kakao/login')
  @Redirect()
  async kakaoLogin(@Query('redirect') redirect: string) {
    const redirectUrl = this.authService.getKakaoLoginRedirectUrl(redirect);
    return {
      url: redirectUrl,
    };
  }

  @ApiOperation({ summary: '카카오 로그인 콜백 처리' })
  @ApiQuery({ name: 'code', description: '카카오 인증 코드', required: true })
  @ApiQuery({
    name: 'state',
    description: '로그인 후 돌아갈 URL',
    required: false,
  })
  @ApiResponse({ status: 302, description: '로그인 완료 후 리디렉트' })
  @Get('kakao/callback')
  async kakaoCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    const kakaoAccessToken = await this.authService.getKakaoAccessToken(code);
    const kakaoUserInfo = await this.authService.getKakaoUserInfo(
      kakaoAccessToken,
    );

    const user = await this.authService.findOrCreateUser(kakaoUserInfo);
    const token = this.authService.generateAccessToken(user);

    res.cookie('access_token', token, {
      httpOnly: false,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(state ?? '/');
  }
}
