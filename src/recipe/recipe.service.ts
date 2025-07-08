import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';

@Injectable()
export class RecipeService {
  //   private youtube = google.youtube('v3');
  //   private apiKey = 'YOUR_YOUTUBE_API_KEY'; // 🔥 실제 키로 변경

  async searchRecipes(query: string) {
    if (!query) {
      return [];
    }

    /** TODO : 유튜브 API로 영상정보 가져오기 */
    // // 1️⃣ Search API로 영상 ID 가져오기
    // const searchRes = await this.youtube.search.list({
    //   key: this.apiKey,
    //   q: query,
    //   type: 'video',
    //   part: ['id'],
    //   maxResults: 5,
    // });

    // const videoIds = searchRes.data.items
    //   ?.map((item) => item.id?.videoId)
    //   .filter(Boolean) as string[];

    // if (videoIds.length === 0) {
    //   return [];
    // }

    // // 2️⃣ Videos API로 상세 정보 가져오기
    // const videoRes = await this.youtube.videos.list({
    //   key: this.apiKey,
    //   id: videoIds.join(','),
    //   part: ['snippet', 'statistics'],
    // });
    const videoRes = { data: { items: [] } }; // TODO : 유튜브 결과의 가공값을 담을 곳

    // 3️⃣ 원하는 형태로 가공
    return (
      videoRes.data.items?.map((item) => ({
        title: item.snippet?.title,
        description: item.snippet?.description,
        link: `https://www.youtube.com/watch?v=${item.id}`,
        youtuber: item.snippet?.channelTitle,
        published_at: item.snippet?.publishedAt,
        view_count: Number(item.statistics?.viewCount) || 0,
        created_at: new Date(),
        updated_at: new Date(),
      })) || []
    );
  }
}
