import { Types } from "mongoose";

export interface CommonBreadcrumbType {
  title: string;
  parent?: string;
  element?: JSX.Element;
}
export interface AdminValues {
  _id: string;
  role: string;
  email?: string;
  phone_number?: string;
  name: string;
  image: string;
  password?: string;
  createdAt: string;
}

export interface User {
  role: string;
  email?: string;
  password?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  profile_image: string;
  date_of_birth?: Date;
  gender?: "male" | "female" | "others";
  flat_plot?: string;
  address?: string;
  country: string;
  region_state?: string;
  city?: string;
  zip_code?: string;
  wishlist_products?: string[];

  altPhone: string;
  status: string;
  addressLine1: string;
  addressLine2: string;
  firstName: string;
  lastName: string;
  phone: string;
  alt_phone?: string; // defaults to ''
  address_line1: string;
  address_line2?: string; // defaults to ''
  landmark?: string;
  state: string; // defaults to 'India'
  postalCode: string;
  address_type: "Home" | "Work" | "Other"; // enum with default 'Home'
  is_default?: boolean; // defaults to false
  user_id?: Types.ObjectId; // ref to User :contentReference[oaicite:0]{index=0}

  // Timestamps (added by `{ timestamps: true }`)
  created_at?: Date;
  updated_at?: Date;
}

export interface ShippingAddress {
  firstName: string;
  last_name: string;
  phone: string;
  email: string;
  alt_phone?: string; // defaults to ''
  address_line1: string;
  address_line2?: string; // defaults to ''
  landmark?: string; // defaults to ''
  city: string;
  state: string;
  country?: string; // defaults to 'India'
  postal_code: string;
  address_type: "Home" | "Work" | "Other"; // enum with default 'Home'
  is_default?: boolean; // defaults to false
  user_id?: Types.ObjectId; // ref to User :contentReference[oaicite:0]{index=0}

  // Timestamps (added by `{ timestamps: true }`)
  created_at?: Date;
  updated_at?: Date;
}

// order types

export interface Product {
  product_id: Types.ObjectId;
  variant_flavor: string;
  quantity: number;
}

export interface OrderInfo {
  order_id: string;
  payment_method: "online" | "cash-on-delivery";
  total_price: number;

  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;

  order_date: Date;
  delivery_date?: Date;
  shipping_date?: Date;
  cancelled_date?: Date;
  // phone_number: string;
  // shipping_address: string;
  // zip_code: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface OrderDetails {
  order_info: OrderInfo;
  products: Product[];
}

export interface Order extends Document {
  user_id: Types.ObjectId;
  user_name: string;
  orders: OrderDetails[];
}
export interface OrderValues {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  user_name: string;
  orders: OrderDetails[];
}

// export interface OrderInfo {
//   order_id: string;
//   total_price: number;
//   order_date: Date;
//   delivery_date: Date;
//   shipping_date: Date;
//   cancelled_date: null;
//   phone_number: string;
//   shipping_address: string;
//   zip_code: string;
//   status: string;
// }

// export interface Order {
//   user_id: ObjectId;
//   orders: {
//     order_info: OrderInfo;
//     products: any[]; // Adjust this type as necessary
//   }[];
// }
