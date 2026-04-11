import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { OrderModule, ProductModule } from "../modules";

const routes = [
  {
    path: "/order",
    module: OrderModule,
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
