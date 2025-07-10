import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyRecipeService } from './my-recipe.service';
import { MyRecipeController } from './my-recipe.controller';
import { User } from 'src/entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MyRecipeService],
  controllers: [MyRecipeController],
})
export class MyRecipeModule {}
