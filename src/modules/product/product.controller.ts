import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Product")
@Controller("")
export class ProductController {
  constructor() {}

  @Get()
  getProducts() {
    return { message: "List of products" };
  }

  @Get(":id")
  getProductById() {
    return { message: "Product details" };
  }
}
