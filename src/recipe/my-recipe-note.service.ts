import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyRecipeNote } from 'src/entity/my-recipe-notes/my-recipe-note.entity';

@Injectable()
export class MyRecipeNoteService {
  constructor(
    @InjectRepository(MyRecipeNote)
    private myRecipeNoteRepository: Repository<MyRecipeNote>,
  ) {}

  async getMyRecipeNote(videoId: string, userId: number) {
    const note = await this.myRecipeNoteRepository.findOne({
      where: { youtubeId: videoId, user: { id: userId } },
    });

    return {
      content: note?.content || '',
    };
  }

  async saveMyRecipeNote(videoId: string, content: string, userId: number) {
    // 🔥 유저와 레시피로 노트 찾기
    let note = await this.myRecipeNoteRepository.findOne({
      where: {
        youtubeId: videoId,
        user: { id: userId },
      },
    });

    if (!note) {
      note = this.myRecipeNoteRepository.create({
        youtubeId: videoId,
        user: { id: userId },
        content,
      });
    } else {
      note.content = content;
    }

    await this.myRecipeNoteRepository.save(note);

    return {
      message: 'Note saved successfully',
    };
  }
}
