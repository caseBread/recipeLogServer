import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MyRecipeService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMyRecipes(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    return user.myRecipes || [];
  }

  async addMyRecipe(userId: number, youtubeId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.myRecipes) {
      user.myRecipes = [];
    }

    if (!user.myRecipes.includes(youtubeId)) {
      user.myRecipes.push(youtubeId);
      await this.userRepository.save(user);
    }

    return { message: 'Recipe added to myRecipes' };
  }

  async removeMyRecipe(userId: number, youtubeId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.myRecipes = (user.myRecipes || []).filter((id) => id !== youtubeId);
    await this.userRepository.save(user);

    return { message: 'Recipe removed from myRecipes' };
  }
}
