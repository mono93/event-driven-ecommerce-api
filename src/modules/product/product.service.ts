import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductResponse } from "./models/productResponse.model";
import { ProductDoc } from "./models/product.model";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel("Product")
    private readonly productModel: Model<ProductDoc>,
  ) {}

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

  async getProductsByStripePriceIds(stripePriceIds: string[]) {
    try {
      const res = await this.productModel.find({ stripePriceId: { $in: stripePriceIds } }).exec();

      if (!res || res.length === 0) {
        this.logger.warn(`Products not found with Stripe price IDs: ${stripePriceIds.join(", ")}`);
        throw new NotFoundException(`Products with provided Stripe IDs not found`);
      }

      this.logger.log(`Fetched products by Stripe Price IDs: ${stripePriceIds.join(", ")}`);
      return res;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching products by Stripe IDs: ${stripePriceIds.join(", ")}`,
        error,
      );
      throw new InternalServerErrorException(
        "Failed to retrieve products. Please check the Stripe IDs format.",
      );
    }
  }
}
