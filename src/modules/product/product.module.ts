import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ResponseModule } from "../../services/response/response.module";
import { productSchema } from "./models/product.mode";

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([
      { name: "product", schema: productSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
