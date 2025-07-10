import {
  Controller,
  Get,
  Delete,
  Query,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { MyRecipeService } from './my-recipe.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('myRecipes')
@UseGuards(JwtAuthGuard)
export class MyRecipeController {
  constructor(
    private readonly myRecipeService: MyRecipeService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getMyRecipes(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.id;
    const youtubeIds = await this.myRecipeService.getMyRecipes(userId);

    if (!youtubeIds || youtubeIds.length === 0) {
      return [];
    }

    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');

    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos`;
    const params = {
      key: apiKey,
      id: youtubeIds.join(','), // ✅ 쉼표로 join
      part: 'snippet,statistics',
    };

    const res = await axios.get(detailsUrl, { params });

    // 필요한 데이터만 추려서 가공
    return (
      res.data.items?.map((item) => ({
        id: item.id,
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
      })) || []
    );
  }

  @Post()
  async addMyRecipe(
    @Req() req: Request,
    @Query('youtubeId') youtubeId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.id;
    return this.myRecipeService.addMyRecipe(userId, youtubeId);
  }

  @Delete()
  async removeMyRecipe(
    @Req() req: Request,
    @Query('youtubeId') youtubeId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.id;
    return this.myRecipeService.removeMyRecipe(userId, youtubeId);
  }
}
