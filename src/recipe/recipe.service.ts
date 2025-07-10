import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { MyRecipeNote } from 'src/entity/my-recipe-notes/my-recipe-note.entity';
import { Recipe } from 'src/entity/recipes/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeService {
  private readonly youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(
    private configService: ConfigService,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(MyRecipeNote)
    private myRecipeNoteRepository: Repository<MyRecipeNote>,
  ) {}

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
      maxResults: 20,
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
        id: item.id, // unique key
        title: item.snippet?.title,
        description: item.snippet?.description,
        link: `https://www.youtube.com/watch?v=${item.id}`,
        youtuber: item.snippet?.channelTitle,
        published_at: item.snippet?.publishedAt,
        view_count: Number(item.statistics?.viewCount) || 0,
        thumbnailUrl:
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.standard?.url ||
          '',
        created_at: new Date(),
        updated_at: new Date(),
      })) || []
    );
  }

  /**
   * 📄 상세 조회 API
   */
  async getYoutubeVideoDetail(videoId: string) {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');

    const detailsUrl = `${this.youtubeBaseUrl}/videos`;
    const params = {
      key: apiKey,
      id: videoId,
      part: 'snippet,statistics',
    };

    const videoRes = await axios.get(detailsUrl, { params });
    const video = videoRes.data.items?.[0];

    if (!video) return null;

    return {
      id: video.id,
      title: video.snippet?.title,
      description: video.snippet?.description,
      link: `https://www.youtube.com/watch?v=${video.id}`,
      youtuber: video.snippet?.channelTitle,
      published_at: video.snippet?.publishedAt,
      view_count: Number(video.statistics?.viewCount) || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }
}
