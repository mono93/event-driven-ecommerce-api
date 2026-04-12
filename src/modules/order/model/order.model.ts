import mongoose from "mongoose";

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  count: number;
  subtotal: number;
}

interface OrderAttrs {
  userId: mongoose.Types.ObjectId;
  totalOrderPrice: number;
  items: OrderItem[];
}

interface OrderDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  totalOrderPrice: number;
  items: OrderItem[];
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    totalOrderPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        count: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    collection: "order",
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("order", orderSchema);

export { Order };
export { orderSchema };
export type { OrderDoc, OrderModel };
