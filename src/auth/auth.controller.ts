import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
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
  async kakaoCallback(@Query('code') code: string) {
    const accessToken = await this.authService.getKakaoAccessToken(code);
    const userInfo = await this.authService.getKakaoUserInfo(accessToken);

    return {
      accessToken,
      userInfo,
    };
  }
}
