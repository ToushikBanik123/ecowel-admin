// app/api/shipping-address/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { connectToMongoDB } from "@/lib/db";
import ShippingAddress from "@/models/ShippingAddress";

export async function GET() {

    try {
        await connectToMongoDB();
        const addresses = await ShippingAddress.find();
        return NextResponse.json(addresses);
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
        return NextResponse.json(
            { error: "Failed to fetch shipping addresses" },
            { status: 500 }
        );
    }
 
}

export async function POST(req: NextRequest) {
    try {

        await connectToMongoDB();
        const data = await req.json();
        const newAddress = await ShippingAddress.create(data);
        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        console.error("Error creating shipping address:", error);
        revalidatePath(req.url);
        return NextResponse.json(
            { error: "Failed to create shipping address" },
            { status: 500 }
        );
    }
 
}
