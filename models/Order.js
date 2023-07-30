// #### Order Schema

// - [] create Order.js in models folder
// - [] create Schema
// - [] tax : {type:Number}
// - [] shippingFee: {type:Number}
// - [] subtotal: {type:Number}
// - [] total: {type:Number}
// - [] orderItems:[]
// - [] status:{type:String}
// - [] user
// - [] clientSecret:{type:String}
// - [] paymentId:{type:String}
// - [] set timestamps
// - [] export Order model
const mongoose = require("mongoose");

const singleProductCartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
});
const orderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [singleProductCartItemSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
