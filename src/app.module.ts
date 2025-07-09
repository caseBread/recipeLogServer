import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Recipe } from './entity/recipes/recipe.entity';
import { MyRecipe } from './entity/my-recipes/my-recipe.entity';
import { MyRecipeNote } from './entity/my-recipe-notes/my-recipe-note.entity';
import { RecipeModule } from './recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root', // 사용자 이름
      password: '', // 사용자 비밀번호
      database: 'recipe_log_db', // DB 이름
      entities: [Recipe, MyRecipe, MyRecipeNote],
      synchronize: true, // 개발용: true (자동 테이블 생성), 운영 시 false 권장
    }),
    RecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
