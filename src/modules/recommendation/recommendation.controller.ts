import { Controller, Get, Param } from '@nestjs/common';
// @ts-ignore
import { ItemBasedCollaborativeFiltering } from './item-based-collaborative-filtering';

@Controller('recommendations')
export class RecommendationController {
    private readonly algorithm: ItemBasedCollaborativeFiltering;

    constructor() {
        // 加载评分矩阵
        const ratings: Rating[] = [];
        this.algorithm = new ItemBasedCollaborativeFiltering(ratings);
    }

    @Get(':itemId/similar')
    getSimilarItems(@Param('itemId') itemId: string): string[]{
        return this.algorithm.getSimilarItems(itemId, 5); // 假设返回最相似的5个物品
    }
}

interface Rating {
  userId: string;
  itemId: string;
  rating: number;
}

class ItemBasedCollaborativeFiltering {
  private readonly ratings: Rating[];

  constructor(ratings: Rating[]) {
    this.ratings = ratings;
  }

  // 计算物品之间的余弦相似度
  private calculateSimilarity(item1Id: string, item2Id: string): number {
    const ratingsForItem1 = this.ratings.filter((r) => r.itemId === item1Id);
    const ratingsForItem2 = this.ratings.filter((r) => r.itemId === item2Id);

    const dotProduct = ratingsForItem1.reduce((sum, r1, i) => {
      const r2 = ratingsForItem2[i];
      if (r2) {
        return (
          sum +
          (r1.rating - this.mean(ratingsForItem1)) *
            (r2.rating - this.mean(ratingsForItem2))
        );
      }
      return sum;
    }, 0);

    const norm1 = Math.sqrt(
      ratingsForItem1.reduce(
        (sum, r) => sum + Math.pow(r.rating - this.mean(ratingsForItem1), 2),
        0,
      ),
    );
    const norm2 = Math.sqrt(
      ratingsForItem2.reduce(
        (sum, r) => sum + Math.pow(r.rating - this.mean(ratingsForItem2), 2),
        0,
      ),
    );

    return dotProduct / (norm1 * norm2);
  }

  private mean(ratings: Rating[]): number {
    return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  }

  // 获取与给定物品最相似的物品列表
  getSimilarItems(itemId: string, n: number): string[] {
    const similarities = this.ratings.reduce(
      (acc, rating) => {
        if (rating.itemId !== itemId) {
          acc[rating.itemId] =
            (acc[rating.itemId] || 0) +
            this.calculateSimilarity(itemId, rating.itemId);
        }
        return acc;
      },
      {} as { [key: string]: number },
    );

    // 根据相似度对物品进行排序并返回前 n 个
    return Object.entries(similarities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([itemId]) => itemId);
  }
}