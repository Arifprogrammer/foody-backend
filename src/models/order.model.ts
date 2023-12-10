import { Schema, Types, model } from "mongoose";
import { Food, FoodSchema } from "./food.model";
import { OrderStatus } from "../constants/order_status";

export interface OrderItem {
  food: Food;
  price: number;
  quantity: number;
}

export const OrderItemSchema = new Schema<OrderItem>({
  food: { type: FoodSchema, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  name: string;
  email: string;
  paymentId: string;
  status: OrderStatus;
  user: Types.ObjectId;
  /* createdAt: Date;
  updatedAt: Date; */
}

export const orderSchema = new Schema<Order>(
  {
    id: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    paymentId: { type: String },
    status: { type: String, default: OrderStatus.NEW },
    user: { type: Schema.Types.ObjectId, required: true },
    // createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const orderModel = model<Order>("order", orderSchema);
