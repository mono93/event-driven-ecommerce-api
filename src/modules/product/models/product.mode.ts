import mongoose from "mongoose";

interface ProductAttrs {
  id?: string;
  name: string;
  description: string;
  price: number;
}

interface ProductDoc extends mongoose.Document {
  id?: string;
  name: string;
  description: string;
  price: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "product",
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>("product", productSchema);

export { Product };
export { productSchema };
