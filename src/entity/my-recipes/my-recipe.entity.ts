import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('my_recipes')
export class MyRecipe {
  @ApiProperty({ example: 1, description: '나의 레시피 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Recipe, description: '저장한 레시피 정보' })
  @ManyToOne(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '레시피를 저장한 일시',
  })
  @CreateDateColumn()
  created_at: Date;
}
