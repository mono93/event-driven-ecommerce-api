import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsArray, ValidateNested, Min } from "class-validator";
import { Type } from "class-transformer";

class OrderItemDTO {
  @ApiProperty({ example: "price..." })
  @IsString()
  priceId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO {
  @ApiProperty({ example: "60f7...user_id" })
  @IsString()
  userId: string;

  @ApiProperty({ type: [OrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}
