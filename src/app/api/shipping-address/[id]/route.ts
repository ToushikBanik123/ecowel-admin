// app/api/shipping-address/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { connectToMongoDB } from "@/lib/db";
import ShippingAddress from "@/models/ShippingAddress";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await connectToMongoDB();
      const addr = await ShippingAddress.findById(params.id);
      if (!addr) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(addr);
    } catch (error) {
      console.error("GET /shipping-address error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
  export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await connectToMongoDB();
      const updates = await req.json();
      const updated = await ShippingAddress.findByIdAndUpdate(
        params.id,
        updates,
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      // optional: revalidatePath('/your-path') if you need ISR invalidation
      return NextResponse.json(updated);
    } catch (error) {
      console.error("PATCH /shipping-address error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await connectToMongoDB();
      const deleted = await ShippingAddress.findByIdAndDelete(params.id);
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      // optional: revalidatePath('/your-path') if you need ISR invalidation
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("DELETE /shipping-address error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
