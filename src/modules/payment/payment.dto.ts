import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsUrl, ValidateNested, Min, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

class PaymentItemDTO {
  @ApiProperty({
    example: "price_1RxyzABC123",
  })
  @IsString()
  priceId: string;

  @ApiProperty({
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePaymentDTO {
  @ApiProperty({
    example: "662f0d4c9e1a23b456789abc",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: "662f0d4c9e1a23b456789abc",
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    type: [PaymentItemDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDTO)
  items: PaymentItemDTO[];

  @ApiProperty({
    example: "http://localhost:3000/payment/success",
  })
  @IsString()
  @IsUrl()
  successUrl: string;

  @ApiProperty({
    example: "http://localhost:3000/payment/cancel",
  })
  @IsString()
  @IsUrl()
  cancelUrl: string;
}

export class CancelPaymentDto {
  @ApiProperty({
    example: "cs_test_a1b2c3d4",
    description: "Stripe checkout session id",
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
