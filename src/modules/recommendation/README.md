> typescript
interface Rating {  
userId: string;  
itemId: string;  
rating: number;  
}

定义一个名为 Rating 的接口，用于描述一个评分对象。每个评分对象都包含 userId（用户ID）、itemId（物品ID）和 rating（评分值 使用购买数量代替）。

筛选物品评分
>const ratingsForItem1 = this.ratings.filter(r => r.itemId === item1Id);  
const ratingsForItem2 = this.ratings.filter(r => r.itemId === item2Id);

通过 filter 方法筛选出与 item1Id 和 item2Id 对应的评分数据。

计算点积
>const dotProduct = ratingsForItem1.reduce((sum, r1, i) => {  
const r2 = ratingsForItem2[i];  
if (r2) {  
return sum + (r1.rating - this.mean(ratingsForItem1)) * (r2.rating - this.mean(ratingsForItem2));  
}  
return sum;  
}, 0);

使用 reduce 方法计算两个物品评分数组的点积。这里考虑了评分与各自物品平均评分的偏差。

计算范数
>const norm1 = Math.sqrt(ratingsForItem1.reduce((sum, r) => sum + Math.pow(r.rating - this.mean(ratingsForItem1), 2), 0));  
const norm2 = Math.sqrt(ratingsForItem2.reduce((sum, r) => sum + Math.pow(r.rating - this.mean(ratingsForItem2), 2), 0));

计算两个物品评分数组的范数，用于归一化点积。

返回相似度
>return dotProduct / (norm1 * norm2);

返回点积与两个范数乘积的比值，即余弦相似度。

计算平均值
>private mean(ratings: Rating[]): number {  
return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;  
}

计算相似度并存储
>const similarities = this.ratings.reduce((acc, rating) => {  
if (rating.itemId !== itemId) {  
acc[rating.itemId] = (acc[rating.itemId] || 0) + this.calculateSimilarity(itemId, rating.itemId);  
}  
return acc;  
}, {} as { [key: string]: number });

使用 reduce 方法遍历评分数组，计算每个物品与给定物品的相似度，并存储在 similarities 对象中。

排序并返回结果
>return Object.entries(similarities)  
.sort((a, b) => b[1] - a[1])  
.slice(0, n)  
.map(([itemId]) => itemId);

对 similarities 对象进行排序（按相似度降序），取前 n 个物品，并返回它们的 ID 数组。
