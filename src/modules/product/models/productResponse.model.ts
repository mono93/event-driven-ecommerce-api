import { ApiProperty } from "@nestjs/swagger";

export class ProductResponse {
  @ApiProperty({ example: "123" })
  id: string;

  @ApiProperty({ example: "Product Name" })
  name: string;

  @ApiProperty({ example: "Product description" })
  description: string;

  @ApiProperty({ example: 99.99 })
  price: number;
}

export class PaginatedProductResponse {
  @ApiProperty({ type: [ProductResponse] })
  products: ProductResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  tottalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}
