import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe } from 'src/entity/recipes/recipe.entity';
import { MyRecipeNote } from 'src/entity/my-recipe-notes/my-recipe-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, MyRecipeNote])],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
