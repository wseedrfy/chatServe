import {Controller, Get, Param, Res} from '@nestjs/common';
import {Response} from 'express';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderRepository} from './order.repository';

@Controller('order')
export class OrderController {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
    ) {
    }

    @Get(':studentId/items')
    async getItemsPurchasedByStudentId(
        @Param('studentId') studentId: string,
        @Res() res: Response,
    ): Promise<void> {
        try {
            const items = await this.orderRepository.query(
                `
                    SELECT productId,
                           SUM(quantity)                                                AS totalQuantity,
                           SUM(quantity) * (DATEDIFF(CURDATE(), MAX(purchaseDate)) + 1) AS score
                    FROM purchase_records
                    WHERE studentId = ?
                    GROUP BY productId
                    ORDER BY score DESC;
                `,
                [studentId],
            );
            res.status(200).json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Error retrieving items'});
        }
    }
}