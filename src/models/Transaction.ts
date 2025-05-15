import { Schema, model, models } from "mongoose";

// 1. Define the schema
const TransactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    order_id: {
      type: String,
      required: true,
      index: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Schema.Types.Double,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      required: true
    },
    productInfo: {
      type: String,
      default: ""
    },
    // any additional gateway-specific fields
    gatewayResponse: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// 2. Compile model (use existing if already compiled)
const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
