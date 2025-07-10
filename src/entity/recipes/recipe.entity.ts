import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('recipes')
export class Recipe {
  @ApiProperty({ example: 1, description: '레시피 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '불맛 가득 볶음밥', description: '레시피 제목' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    example: '간단하고 맛있는 볶음밥 레시피',
    description: '레시피 상세 설명',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: '유튜브 링크',
  })
  @Column({ type: 'varchar', length: 255 })
  link: string;

  @ApiProperty({ example: '백종원', description: '유튜버 이름' })
  @Column({ type: 'varchar', length: 255 })
  youtuber: string;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '유튜브 영상 업로드 날짜',
  })
  @Column({ type: 'datetime' })
  published_at: Date;

  @ApiProperty({ example: 123456, description: '조회수' })
  @Column({ type: 'int', default: 0 })
  view_count: number;

  @ApiProperty({ example: 'dQw4w9WgXcQ', description: '유튜브 영상 ID' })
  @Column({ type: 'varchar', length: 255 })
  youtubeId: string;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '데이터 생성 일시',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '데이터 업데이트 일시',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
