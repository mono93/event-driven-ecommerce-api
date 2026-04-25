import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CreatePaymentDTO } from "./payment.dto";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDoc } from "../user/model/user.model";

@Injectable()
export class PaymentService {
  private readonly stripe: InstanceType<typeof Stripe>;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel("User")
    private readonly userModel: Model<UserDoc>,

    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY")!);
  }

  async createCheckoutSession(paymentDto: CreatePaymentDTO) {
    const { items, successUrl, cancelUrl, userId } = paymentDto;

    this.logger.log(
      `Creating checkout session for userId: ${userId} with items: ${JSON.stringify(items)}`,
    ); // Log the incoming request details

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid userId");
    }

    const user = await this.userModel.findById(userId).exec();

    this.logger.log(`Fetched user for payment`, user); // Log the fetched user details

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: "cus_U6dRj9Fgl2f51r", // TODO: Fist check in stripe if a customer exists for the user, if not create one and use that customer id here
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

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
      ); // Log the received webhook event

      switch (event.type) {
        case "checkout.session.completed":
          // await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case "checkout.session.async_payment_succeeded":
          // await this.handleAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session);
          break;
        case "checkout.session.async_payment_failed":
          // await this.handleAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
          break;
        case "payment_intent.succeeded":
          // await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
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
}
