import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CreatePaymentDTO } from "./payment.dto";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc } from "../user/model/user.model";
import { PaymentDoc } from "./model/payment.model";
import { OrderDoc } from "../order/model/order.model";

@Injectable()
export class PaymentService {
  private readonly stripe: InstanceType<typeof Stripe>;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel("User")
    private readonly userModel: Model<UserDoc>,

    @InjectModel("Payment")
    private readonly paymentModel: Model<PaymentDoc>,

    @InjectModel("Order")
    private readonly orderModel: Model<OrderDoc>,

    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY")!);
  }

  async createCheckoutSession(paymentDto: CreatePaymentDTO) {
    const { items, successUrl, cancelUrl, userId, orderId } = paymentDto;

    this.logger.log(
      `Creating checkout session for userId: ${userId} with items: ${JSON.stringify(items)}`,
    );

    const stripeCustomerId = await this.getStripeCustomerIdForUser(userId);

    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${successUrl}&session_id=` + "{CHECKOUT_SESSION_ID}",
      cancel_url: `${cancelUrl}&session_id=` + "{CHECKOUT_SESSION_ID}",
    });

    await this.createPaymentRecord(session.id, userId, orderId);

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async handleWebhook(body: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.configService.get<string>("STRIPE_WEBHOOK_SECRET")!,
      );

      this.logger.log(
        `Received webhook event: ${event.type}, data: ${JSON.stringify(event.data.object)}`,
      );

      switch (event.type) {
        case "checkout.session.completed":
          break;
        case "payment_intent.succeeded":
          await this.updatePaymentStatusBySessionId(
            event.data.object.payment_details!.order_reference as string,
            event.data.object.id,
            event.data.object.latest_charge as string,
            event.data.object.amount / 100,
            "succeeded",
          );
          break;
        case "payment_intent.payment_failed":
          await this.updatePaymentStatusBySessionId(
            event.data.object.payment_details!.order_reference as string,
            event.data.object.id,
            event.data.object.latest_charge as string,
            event.data.object.amount / 100,
            "failed",
            event.data.object.last_payment_error?.code,
          );
          break;
        default:
          this.logger.warn(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${error}`);
      throw new BadRequestException("Webhook signature verification failed");
    }
  }

  async cancelPayment(sessionId: string) {
    this.logger.log(`Canceling payment for sessionId: ${sessionId}`);

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new NotFoundException("Checkout session not found");
    }

    const payment = await this.paymentModel.findOne({ stripeCheckoutSessionId: sessionId }).exec();

    this.logger.log(`Fetched payment for cancellation`, payment);

    if (payment?.status === "processing") {
      await this.updatePaymentStatusBySessionId(
        sessionId,
        undefined,
        undefined,
        0,
        "canceled",
        "Payment canceled by user",
      );
    }

    return true;
  }

  private async getStripeCustomerIdForUser(userId: string): Promise<string> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid userId");
    }

    const user = await this.userModel.findById(userId).exec();

    this.logger.log(`Fetched user for payment`, user);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    this.logger.log(`Creating new Stripe customer for userId: ${userId}`);

    const address = {
      line1: user.address.line1,
      line2: user.address.line2,
      city: user.address.city,
      postal_code: user.address.postalCode.toString(),
      state: user.address.state,
      country: user.address.country,
    };

    const newCustomer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      address: address,
    });

    await this.userModel.findByIdAndUpdate(userId, { stripeCustomerId: newCustomer.id }).exec();

    return newCustomer.id;
  }

  private async createPaymentRecord(sessionId: string, userId: string, orderId: string) {
    this.logger.log(
      `Creating payment record for sessionId: ${sessionId}, userId: ${userId}, orderId: ${orderId}`,
    );

    return await this.paymentModel.create({
      userId: new Types.ObjectId(userId),
      orderId: new Types.ObjectId(orderId),
      stripeCheckoutSessionId: sessionId,
      status: "processing",
    });
  }

  private async updatePaymentStatusBySessionId(
    sessionId: string,
    stripePaymentIntentId: string | undefined,
    stripeChargeId: string | undefined,
    amount: number,
    status: string,
    failedReason?: string,
  ) {
    this.logger.log(
      `Updating payment record for sessionId: ${sessionId} with status: ${status}, failedReason: ${failedReason}`,
    );

    const payment = await this.paymentModel.findOneAndUpdate(
      { stripeCheckoutSessionId: sessionId },
      { status, failedReason, stripePaymentIntentId, stripeChargeId, amount },
      { new: true },
    );

    if (!payment) {
      this.logger.warn(`Payment not found for sessionId: ${sessionId}`);
      return;
    }

    let orderStatus = "PENDING";

    if (status === "succeeded") {
      orderStatus = "success";
    } else if (status === "failed" || status === "canceled") {
      orderStatus = "failed";
    }

    await this.orderModel.findByIdAndUpdate(
      payment.orderId,
      { status: orderStatus },
      { new: true },
    );

    this.logger.log(`Order ${payment.orderId} updated with status: ${orderStatus}`);
  }
}
