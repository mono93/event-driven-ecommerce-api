import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { ResponseService } from "../../services/response/response.service";
import { CreatePaymentDTO } from "./payment.dto";

@ApiTags("Payment")
@Controller("")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly responseService: ResponseService,
  ) {}

  @Post("create-checkout-session")
  @HttpCode(303)
  @ApiOperation({ summary: "Create a Stripe checkout session" })
  @ApiResponse({
    status: 303,
    description: "Checkout session created successfully",
  })
  async createCheckoutSession(@Body() paymentDto: CreatePaymentDTO, @Res() res: Response) {
    const session = await this.paymentService.createCheckoutSession(paymentDto);
    return this.responseService.success(res, HttpStatus.FOUND, "Checkout session created", session);
  }

  @Post("webhook")
  async handleStripeWebhook(
    @Req() request: Request,
    @Headers("stripe-signature") signature: string,
  ) {
    const body =
      request.body instanceof Buffer ? request.body.toString() : JSON.stringify(request.body);
    return await this.paymentService.handleWebhook(body, signature);
  }
}
