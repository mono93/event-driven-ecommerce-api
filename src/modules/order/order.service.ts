import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CreateOrderDTO } from "./order.dto";
import { OrderAttrs, OrderDoc, OrderItem } from "./model/order.model";
import { ProductService } from "../product/product.service";
import { UserDoc } from "../user/model/user.model";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel("Order")
    private readonly orderModel: Model<OrderDoc>,

    @InjectModel("User")
    private readonly userModel: Model<UserDoc>,

    private readonly productService: ProductService,
  ) {}

  async createOrder(orderDto: CreateOrderDTO): Promise<OrderDoc> {
    try {
      const { userId, items } = orderDto;

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException("Invalid userId");
      }

      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const stripePriceIds = items.map((item) => item.stripePriceId);

      const productDetails =
        await this.productService.getProductsByStripePriceIds(
          stripePriceIds,
        );

      this.logger.log(`Fetched product details`, productDetails); // Log the number of products fetched

      const transformedItems: OrderItem[] = items.map((item) => {
        const product = productDetails.find(
          (p) => p.stripePriceId === item.stripePriceId,
        );

        if (!product) {
          throw new NotFoundException(
            `Product not found for stripePriceId: ${item.stripePriceId}`,
          );
        }

        return {
          productId: new Types.ObjectId(product.id),
          name: product.name,
          price: product.price,
          count: item.count,
          subtotal: product.price * item.count,
        };
      });

      const totalOrderPrice = transformedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      const payload: OrderAttrs = {
        userId: new Types.ObjectId(userId),
        totalOrderPrice,
        items: transformedItems,
      };

      const order = await this.orderModel.create(payload);

      this.logger.log(`Order created: ${order.id}`);

      return order;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error("Failed to create order", error);

      throw new InternalServerErrorException(
        "Failed to create order",
      );
    }
  }

  async getOrders(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        this.orderModel.find().skip(skip).limit(limit).exec(),
        this.orderModel.countDocuments().exec(),
      ]);

      return {
        orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error("Failed to fetch orders", error);

      throw new InternalServerErrorException(
        "Failed to fetch orders",
      );
    }
  }
}