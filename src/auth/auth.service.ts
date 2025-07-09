import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly kakaoClientId = process.env.KAKAO_CLIENT_ID;
  private readonly kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;

  getKakaoLoginRedirectUrl(state: string) {
    const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.kakaoClientId);
    params.append('redirect_uri', this.kakaoRedirectUri);

    if (state) {
      params.append('state', state);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  async getKakaoAccessToken(code: string) {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.kakaoClientId);
    params.append('redirect_uri', this.kakaoRedirectUri);
    params.append('code', code);

    const res = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return res.data.access_token;
  }

  async getKakaoUserInfo(accessToken: string) {
    const res = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }
}
