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

@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly myRecipeNoteService: MyRecipeNoteService,
  ) {}

  @Get()
  async searchRecipes(@Query('query') query: string) {
    return this.recipeService.searchRecipes(query);
  }

  @Get(':videoId')
  async getYoutubeDetail(@Param('videoId') videoId: string) {
    return this.recipeService.getYoutubeVideoDetail(videoId);
  }

  // ✅ 노트 가져오기
  @UseGuards(JwtAuthGuard)
  @Get(':videoId/note')
  async getNote(@Param('videoId') videoId: string, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user?.id as number; // ✅ Passport 전략에서 validate()가 준 값

    return this.myRecipeNoteService.getMyRecipeNote(videoId, userId);
  }

  // ✅ 노트 저장/수정
  @UseGuards(JwtAuthGuard)
  @Post(':videoId/note')
  async saveNote(
    @Param('videoId') videoId: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user?.id as number; // ✅ Passport 전략에서 validate()가 준 값
    return this.myRecipeNoteService.saveMyRecipeNote(videoId, content, userId);
  }
}
