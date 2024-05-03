import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    // 假设我们通过查询参数接收 userId
    @Get('recommend')
    async recommendProduct(@Query() product_from: any): Promise<object> {
        return await this.productService.recommendProduct( product_from);
    }
}
