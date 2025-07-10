import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { MyRecipeNoteService } from './my-recipe-note.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly myRecipeNoteService: MyRecipeNoteService,
  ) {}

  @ApiOperation({ summary: '레시피 검색' })
  @ApiQuery({ name: 'query', description: '검색할 키워드', required: true })
  @ApiResponse({ status: 200, description: '검색 결과를 반환합니다.' })
  @Get()
  async searchRecipes(@Query('query') query: string) {
    return this.recipeService.searchRecipes(query);
  }

  @ApiOperation({ summary: '유튜브 영상 상세 정보 조회' })
  @ApiParam({ name: 'videoId', description: '유튜브 영상 ID' })
  @ApiResponse({ status: 200, description: '영상 상세 정보를 반환합니다.' })
  @Get(':videoId')
  async getYoutubeDetail(@Param('videoId') videoId: string) {
    return this.recipeService.getYoutubeVideoDetail(videoId);
  }

  @ApiOperation({ summary: '나의 레시피 노트 조회' })
  @ApiParam({ name: 'videoId', description: '유튜브 영상 ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '나의 노트 내용을 반환합니다.' })
  @UseGuards(JwtAuthGuard)
  @Get(':videoId/note')
  async getNote(@Param('videoId') videoId: string, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user?.id as number;
    return this.myRecipeNoteService.getMyRecipeNote(videoId, userId);
  }

  @ApiOperation({ summary: '나의 레시피 노트 저장/수정' })
  @ApiParam({ name: 'videoId', description: '유튜브 영상 ID' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '마늘을 더 넣으면 좋아요!' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '노트가 저장되었습니다.' })
  @UseGuards(JwtAuthGuard)
  @Post(':videoId/note')
  async saveNote(
    @Param('videoId') videoId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user?.id as number;
    return this.myRecipeNoteService.saveMyRecipeNote(videoId, content, userId);
  }
}
