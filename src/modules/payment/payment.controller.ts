import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { ResponseService } from "../../services/response/response.service";
import { CancelPaymentDto, CreatePaymentDTO } from "./payment.dto";

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
  @HttpCode(202)
  @ApiOperation({ summary: "Webhook handler" })
  @ApiResponse({
    status: 202,
    description: "Webhook received and processed successfully",
  })
  async handleStripeWebhook(
    @Req() request: Request,
    @Headers("stripe-signature") signature: string,
    @Res() res: Response,
  ) {
    const body =
      request.body instanceof Buffer ? request.body.toString() : JSON.stringify(request.body);
    await this.paymentService.handleWebhook(body, signature);
    return this.responseService.success(res, HttpStatus.ACCEPTED, "Webhook received and processed");
  }

  @Post("cancel")
  @HttpCode(200)
  @ApiOperation({ summary: "Cancel a payment" })
  @ApiResponse({
    status: 200,
    description: "Payment canceled successfully",
  })
  async cancelPayment(@Body() cancelPaymentDto: CancelPaymentDto, @Res() res: Response) {
    await this.paymentService.cancelPayment(cancelPaymentDto.sessionId);
    return this.responseService.success(res, HttpStatus.OK, "Payment canceled successfully");
  }
}
