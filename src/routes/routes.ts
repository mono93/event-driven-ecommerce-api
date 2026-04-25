import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { OrderModule, PaymentModule, ProductModule } from "../modules";

const routes = [
  {
    path: "/order",
    module: OrderModule,
  },
  {
    path: "/product",
    module: ProductModule,
  },
  {
    path: "/payment",
    module: PaymentModule,
  },
];

@Module({
  imports: [RouterModule.register(routes)],
})
export class AppRoutingModule {}
