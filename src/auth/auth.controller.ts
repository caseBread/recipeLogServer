import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao/login')
  @Redirect()
  async kakaoLogin(@Query('redirect') redirect: string) {
    const redirectUrl = this.authService.getKakaoLoginRedirectUrl(redirect);
    return {
      url: redirectUrl,
    };
  }

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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(state ?? '/');
  }
}
