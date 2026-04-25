import mongoose from "mongoose";

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
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
