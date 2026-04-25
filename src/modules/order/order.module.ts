import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { orderSchema } from "./model/order.model";
import { userSchema } from "../user/model/user.model";
import { ProductModule } from "../product/product.module";
import { ResponseModule } from "../../services/response/response.module";

@Module({
  imports: [
    ResponseModule,
    ProductModule,
    MongooseModule.forFeature([
      {
        name: "Order",
        schema: orderSchema,
      },
      {
        name: "User",
        schema: userSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
