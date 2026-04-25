import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ResponseModule } from "../../services/response/response.module";
import { productSchema } from "./models/product.model";

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([{ name: "Product", schema: productSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
