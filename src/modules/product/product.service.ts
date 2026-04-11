import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductResponse } from "./models/productResponse.model";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(@InjectModel("product") private readonly productModel: Model<any>) {}

  async getProducts(
    page: number,
    limit: number,
  ): Promise<{
    products: ProductResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    this.logger.log(`Fetching products (Page: ${page}, Limit: ${limit}, Skip: ${skip})`);

    try {
      const [items, totalItems] = await Promise.all([
        this.productModel.find().skip(skip).limit(limit).exec(),
        this.productModel.countDocuments().exec(),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      this.logger.log(`Successfully fetched ${items.length} of ${totalItems} products`);

      return {
        products: items,
        total: totalItems,
        page,
        limit,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      this.logger.error(`Error fetching products: ${error}`);
      throw new InternalServerErrorException("Failed to fetch products. Please try again later.");
    }
  }

  async getProductById(id: string) {
    try {
      const res = await this.productModel.findById(id).exec();

      if (!res) {
        this.logger.warn(`Product not found with ID: ${id}`);
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }

      this.logger.log(`Fetched product by ID: ${id}`);
      return res;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching product by ID: ${id}`, error);
      throw new InternalServerErrorException(
        "Failed to retrieve product. Please check the ID format.",
      );
    }
  }
}
