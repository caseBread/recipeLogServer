import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('my_recipe_notes')
export class MyRecipeNote {
  @ApiProperty({ example: 1, description: '노트 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'dQw4w9WgXcQ', description: '유튜브 영상 ID' })
  @Column({ type: 'varchar', length: 255 })
  youtubeId: string;

  @ApiProperty({ type: () => User, description: '노트를 작성한 유저' })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({
    example: '마늘을 좀 더 넣으면 맛있어요!',
    description: '사용자 작성 노트 내용',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '생성 일시',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2025-07-10T12:10:00.000Z',
    description: '업데이트 일시',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
