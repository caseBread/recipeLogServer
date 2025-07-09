import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RecipeService {
  private readonly youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private configService: ConfigService) {}

  async searchRecipes(query: string) {
    if (!query) {
      return [];
    }

    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');

    // 1️⃣ 검색 리스트 요청 (여기서는 activities가 아니라 search API 사용 권장!)
    const searchUrl = `${this.youtubeBaseUrl}/search`;
    const searchParams = {
      key: apiKey,
      q: query,
      type: 'video',
      part: 'id',
      maxResults: 5,
    };

    const searchRes = await axios.get(searchUrl, { params: searchParams });
    const videoIds = searchRes.data.items
      ?.map((item) => item.id?.videoId)
      .filter(Boolean) as string[];

    if (!videoIds.length) {
      return [];
    }

    // 2️⃣ 영상 상세 정보 요청
    const detailsUrl = `${this.youtubeBaseUrl}/videos`;
    const detailsParams = {
      key: apiKey,
      id: videoIds.join(','),
      part: 'snippet,statistics',
    };

    const detailsRes = await axios.get(detailsUrl, { params: detailsParams });

    // 3️⃣ 결과 가공
    return (
      detailsRes.data.items?.map((item) => ({
        title: item.snippet?.title,
        description: item.snippet?.description,
        link: `https://www.youtube.com/watch?v=${item.id}`,
        youtuber: item.snippet?.channelTitle,
        published_at: item.snippet?.publishedAt,
        view_count: Number(item.statistics?.viewCount) || 0,
        created_at: new Date(),
        updated_at: new Date(),
      })) || []
    );
  }
}
