// src/recipes/recipe.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @Column({ type: 'varchar', length: 255 })
  youtuber: string;

  @Column({ type: 'datetime' })
  published_at: Date;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'varchar', length: 255 })
  youtubeId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
