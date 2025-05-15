import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
import ShippingAddress from "@/models/ShippingAddress";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  console.log(id);

  try {
    await connectToMongoDB();

    const shippingAddress = await ShippingAddress.findOne({
      user_id: id,
      isDefault: true      
    }).lean();

    const user = await User.findOne({ _id: id }).lean();

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    revalidatePath(request.url);
    const addr = shippingAddress ?? {};
    return new NextResponse(JSON.stringify({...user, ...addr}), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
};
