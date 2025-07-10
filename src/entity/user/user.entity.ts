import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: '유저 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '1234567890',
    description: '카카오 고유 ID',
    nullable: true,
  })
  @Column({ nullable: true })
  kakaoId: string;

  @ApiProperty({ example: '요리왕김밥', description: '닉네임', nullable: true })
  @Column({ nullable: true })
  nickname: string;

  @ApiProperty({
    example: ['dQw4w9WgXcQ', 'abcdEFGhIjk'],
    description: '즐겨찾기한 유튜브 영상 ID 목록',
    nullable: true,
    type: [String],
  })
  @Column('simple-array', { nullable: true })
  myRecipes: string[];

  @ApiProperty({
    example: 'https://example.com/profile.png',
    description: '프로필 이미지 URL',
    nullable: true,
  })
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({
    example: '2025-07-10T12:00:00.000Z',
    description: '계정 생성 일시',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-10T12:10:00.000Z',
    description: '계정 업데이트 일시',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
