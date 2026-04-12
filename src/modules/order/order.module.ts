import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { orderSchema } from "./model/order.model";
import { ResponseModule } from "../../services/response/response.module";
import { MongooseModule } from "@nestjs/mongoose";
import { userSchema } from "../user/model/user.model";

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([
      { name: "order", schema: orderSchema },
      { name: "user", schema: userSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
