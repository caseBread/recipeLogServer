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

@Controller('myRecipes')
@UseGuards(JwtAuthGuard)
export class MyRecipeController {
  constructor(private readonly myRecipeService: MyRecipeService) {}

  @Get()
  async getMyRecipes(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.id;
    return this.myRecipeService.getMyRecipes(userId);
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
