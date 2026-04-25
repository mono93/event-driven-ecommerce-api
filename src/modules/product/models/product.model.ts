import mongoose from "mongoose";

export interface ProductAttrs {
  name: string;
  description: string;
  price: number;
  stripeProductId: string;
  stripePriceId: string;
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stripeProductId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    stripePriceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    collection: "products",
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