import mongoose from "mongoose";

export interface AddressAttrs {
  line1: string;
  line2?: string;
  city: string;
  postalCode: number;
  state: string;
}

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  address: AddressAttrs;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  address: AddressAttrs;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    address: {
      line1: {
        type: String,
        required: true,
        trim: true,
      },

      line2: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: Number,
        required: true,
        min: 100000,
        max: 999999,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    collection: "users",
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
