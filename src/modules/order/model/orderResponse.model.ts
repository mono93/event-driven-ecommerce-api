import { ApiProperty } from "@nestjs/swagger";

export class OrderItemResponse {
  @ApiProperty({ example: "60f7...prod_id" })
  productId: string;

  @ApiProperty({ example: "Laptop" })
  name: string;

  @ApiProperty({ example: 1000 })
  price: number;

  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 1000 })
  subtotal: number;
}

export class OrderResponse {
  @ApiProperty({ example: "69da..." })
  id: string;

  @ApiProperty({ example: "60f7...user_id" })
  userId: string;

  @ApiProperty({ example: 1050 })
  totalOrderPrice: number;

  @ApiProperty({ type: [OrderItemResponse] })
  items: OrderItemResponse[];

  @ApiProperty({ example: "2023-10-27T10:00:00.000Z" })
  createdAt: string;

  @ApiProperty({ example: "2023-10-27T10:00:00.000Z" })
  updatedAt: string;
}

export class PaginatedOrderResponse {
  @ApiProperty({ type: [OrderResponse] })
  orders: OrderResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}

export class CreateOrderResponse {
  @ApiProperty({ example: "69da..." })
  orderId: string;
}
