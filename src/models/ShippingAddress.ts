import { Schema, model, models } from "mongoose";

const ShippingAddressSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        altPhone: { type: String, default: '' },
        addressLine1: { type: String, required: true }, 
        addressLine2: { type: String , default: '' },   
        landmark: { type: String , default: '' },   
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: 'India' },
        postalCode: { type: String, required: true },
        addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        isDefault: { type: Boolean, default: false },
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const ShippingAddress = models.ShippingAddress || model("ShippingAddress", ShippingAddressSchema);

export default ShippingAddress;
