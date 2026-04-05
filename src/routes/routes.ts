import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AuthModule, PaymentModule, ProductModule } from "../modules";

const routes = [
  {
    path: "/auth",
    module: AuthModule,
  },
  {
    path: "/payment",
    module: PaymentModule,
  },
  {
    path: "/product",
    module: ProductModule,
  },
];

@Module({
  imports: [RouterModule.register(routes)],
})
export class AppRoutingModule {}
