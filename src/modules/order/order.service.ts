import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDTO } from "./order.dto";
import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { OrderDoc, OrderItem } from "./model/order.model";
import type { OrderModel } from "./model/order.model";
import type { UserModel } from "../user/model/user.model";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel("user") private readonly userModel: UserModel,
    @InjectModel("order") private readonly orderModel: OrderModel,
  ) {}

  async createOrder(orderDto: CreateOrderDTO): Promise<OrderDoc> {
    try {
      const { userId, ...rest } = orderDto;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestException("Invalid userId");
      }

      const user = await this.userModel.findById(userId).exec();

      this.logger.debug("User found:", user);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const transformedItems: OrderItem[] = rest.items.map((item) => ({
        ...item,
        productId: new mongoose.Types.ObjectId(item.productId),
      }));

      const order = this.orderModel.build({
        userId: new mongoose.Types.ObjectId(userId),
        totalOrderPrice: rest.totalOrderPrice,
        items: transformedItems,
      });

      await order.save();

      this.logger.debug("Order Created:", order);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error saving order`, error);
      throw new InternalServerErrorException(
        "Failed to create order. Please check the database connection.",
      );
    }
  }

  async getOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;
    try {
      const [orders, total] = await Promise.all([
        this.orderModel.find().skip(skip).limit(limit).exec(),
        this.orderModel.countDocuments().exec(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        orders,
        total,
        page,
        limit,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      this.logger.error(`Error fetching orders: ${error}`);
      throw new InternalServerErrorException("Failed to fetch orders. Please try again later.");
    }
  }
}
