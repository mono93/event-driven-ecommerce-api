import mongoose from "mongoose";

export type OrderStatus = "pending" | "success" | "failed";

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  count: number;
  subtotal: number;
}

export interface OrderAttrs {
  userId: mongoose.Types.ObjectId;
  totalOrderPrice: number;
  items: OrderItem[];
  status?: OrderStatus;
}

export interface OrderDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  totalOrderPrice: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalOrderPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        count: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    collection: "orders",
    timestamps: true,

    toJSON: {
      versionKey: false,
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);
