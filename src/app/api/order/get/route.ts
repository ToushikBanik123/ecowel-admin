import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";
import ShippingAddress from "@/models/ShippingAddress";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const orders = await Order.find({}).lean();

    // 3️⃣ for each order, loop its .orders[] array and enrich with shipping address
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const items = await Promise.all(
          order.orders.map(async (item: any) => {
            const info = item.order_info;
            if (info.shipping_address_id) {
              const address = await ShippingAddress
                .findById(info.shipping_address_id)
                .lean();
              // merge the address fields under a new key
              item.order_info = { ...info, ...address };
            }
            return item;
          })
        );
        return { ...order, orders: items };
      })
    );

    console.log("enrichedOrders================================================>", enriched);

    revalidatePath(request.url);
    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    revalidatePath(request.url);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
