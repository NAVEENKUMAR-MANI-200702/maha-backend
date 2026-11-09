import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  mainImage?: string;
  additionalImages?: string[];
  quantities?: Record<string, any>;
  isOutOfStock: boolean;
  isRecurringOrder: boolean;
  isDeleted: boolean;
  legacyFirestoreId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
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
    originalPrice: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    mainImage: {
      type: String,
      default: '',
    },
    additionalImages: {
      type: [String],
      default: [],
    },
    quantities: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
    isRecurringOrder: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    legacyFirestoreId: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ isDeleted: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
