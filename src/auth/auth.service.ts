import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }

  async findOrCreateUser(kakaoUserInfo: any): Promise<User> {
    const kakaoId = String(kakaoUserInfo.id);
    let nickname: string = kakaoUserInfo.properties?.nickname;
    let profileImage: string = kakaoUserInfo.properties?.profile_image;

    if (!nickname && kakaoUserInfo.kakao_account?.profile?.nickname) {
      nickname = kakaoUserInfo.kakao_account.profile.nickname;
    }
    if (
      !profileImage &&
      kakaoUserInfo.kakao_account?.profile?.profile_image_url
    ) {
      profileImage = kakaoUserInfo.kakao_account.profile.profile_image_url;
    }

    let user = await this.userRepository.findOneBy({ kakaoId: kakaoId });

    if (!user) {
      user = this.userRepository.create({
        nickname,
        profileImage,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  generateAccessToken(user: User): string {
    const payload = { sub: user.id, nickname: user.nickname };
    return this.jwtService.sign(payload);
  }
}
