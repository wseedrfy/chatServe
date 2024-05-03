import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Product} from './models/product.entity';
import {product_from} from "./dto/result_product";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
    }

    async getProducts(productId: string): Promise<Product> {
        return await this.productRepository.findOne({where: {id: productId}})
    }

    async recommendProduct(product_from: product_from): Promise<object> {
        return await this.productRepository.findOne({where: {id: product_from.userId}})
    }
}
