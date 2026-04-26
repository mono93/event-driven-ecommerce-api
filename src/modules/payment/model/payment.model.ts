import mongoose from "mongoose";

export type PaymentProvider = "stripe";

export type PaymentStatus =
  | "pending"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentAttrs {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount?: number;
  currency?: string;
  provider?: PaymentProvider;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  status?: PaymentStatus;
  failedReason?: string;
}

export interface PaymentDoc extends mongoose.Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  status: PaymentStatus;
  failedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: false,
      min: 0,
    },

    currency: {
      type: String,
      required: false,
      default: "inr",
      lowercase: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
      required: true,
    },

    stripeCheckoutSessionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },

    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },

    stripeChargeId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "requires_action",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    failedReason: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "payments",
    timestamps: true,

    toJSON: {
      versionKey: false,
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },

    toObject: {
      versionKey: false,
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);
