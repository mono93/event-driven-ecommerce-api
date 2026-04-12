import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsArray, ValidateNested, Min } from "class-validator";
import { Type } from "class-transformer";

// 1. Create a DTO for the individual items in the array
class OrderItemDTO {
  @ApiProperty({ example: "60f7..." })
  @IsString()
  productId: string;

  @ApiProperty({ example: "Laptop" })
  @IsString()
  name: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  subtotal: number;
}

// 2. Main Order DTO
export class CreateOrderDTO {
  @ApiProperty({ example: "60f7...user_id" })
  @IsString()
  userId: string;

  @ApiProperty({ example: 1050 })
  @IsNumber()
  @Min(0)
  totalOrderPrice: number;

  @ApiProperty({ type: [OrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true }) // Validates each object in the array
  @Type(() => OrderItemDTO) // Tells class-transformer how to hydrate the objects
  items: OrderItemDTO[];
}
