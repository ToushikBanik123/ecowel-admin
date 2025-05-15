import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const session = await getServerSession(authOptions);
    console.log("User session backend ====================>:", session?.user);

    const userId = session?.user?._id;

    const query: any = {
      $or: [
        { draft: { $exists: false } },
        { draft: false },
      ],
    };

    if (userId && mongoose?.isValidObjectId(userId)) {
      query.$or.push({
        draft: true,
        created_by: userId,
      });
    }

    console.log("query===================", query);
    const products = await Products.find(query);

    revalidatePath(request.url);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};