import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { ResponseModule } from "../../services/response/response.module";
import { MongooseModule } from "@nestjs/mongoose";
import { paymentSchema } from "./model/payment.model";
import { userSchema } from "../user/model/user.model";
import { orderSchema } from "../order/model/order.model";

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([
      {
        name: "Payment",
        schema: paymentSchema,
      },

      {
        name: "User",
        schema: userSchema,
      },
      {
        name: "Order",
        schema: orderSchema,
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
