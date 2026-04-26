import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse, ApiSingleResponse } from "../../common/decorators/swagger.decorator";
import { PaginatedProductResponse, ProductResponse } from "./models/productResponse.model";
import { ProductService } from "./product.service";
import { ResponseService } from "../../services/response/response.service";
import type { Response } from "express";

@ApiTags("Product")
@Controller("")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseService: ResponseService,
  ) {}

  @Get("list")
  @ApiPaginatedResponse(PaginatedProductResponse, "Get a paginated list of products")
  async getProducts(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response,
  ) {
    if (page < 1) {
      throw new BadRequestException("Page number must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException("Limit must be greater than 0");
    }

    const productRes = await this.productService.getProducts(page, limit);

    return this.responseService.success(
      res,
      HttpStatus.OK,
      "Products retrieved successfully",
      productRes,
    );
  }

  @Get(":id")
  @ApiSingleResponse(ProductResponse, "Get product details by ID")
  async getProductById(@Param("id") id: string, @Res() res: Response) {
    if (!id) {
      throw new BadRequestException("product id not available");
    }

    const productRes = await this.productService.getProductById(id);

    return this.responseService.success(
      res,
      HttpStatus.OK,
      "Products retrieved successfully",
      productRes,
    );
  }
}
