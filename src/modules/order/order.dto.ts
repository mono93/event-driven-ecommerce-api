import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsArray, ValidateNested, Min } from "class-validator";
import { Type } from "class-transformer";

// 1. Create a DTO for the individual items in the array
class OrderItemDTO {
  @ApiProperty({ example: "price..." })
  @IsString()
  stripePriceId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  count: number;
}

// 2. Main Order DTO
export class CreateOrderDTO {
  @ApiProperty({ example: "60f7...user_id" })
  @IsString()
  userId: string;

  @ApiProperty({ type: [OrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true }) // Validates each object in the array
  @Type(() => OrderItemDTO) // Tells class-transformer how to hydrate the objects
  items: OrderItemDTO[];
}
