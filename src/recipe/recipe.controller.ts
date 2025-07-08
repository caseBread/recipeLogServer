import { Controller, Get, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async searchRecipes(@Query('query') query: string) {
    return this.recipeService.searchRecipes(query);
  }
}
