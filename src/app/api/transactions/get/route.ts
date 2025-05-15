import { NextResponse, NextRequest } from 'next/server';
import {connectToMongoDB} from "@/lib/db";
import Transaction from '@/models/Transaction';
import { revalidatePath } from "next/cache";


interface Filter {
  transactionId?: string;
  order_id?: string;
  user_id?: string;
}

export const GET = async (request: NextRequest) => {

  try {
    await connectToMongoDB();

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const orderId = searchParams.get('order_id');
    const userId = searchParams.get('user_id');

    let filter: Filter = {};
    let isMultiple = false;

    if (transactionId) {
      filter.transactionId = transactionId;
    } else if (orderId) {
      filter.order_id = orderId;
      isMultiple = true;
    } else if (userId) {
      filter.user_id = userId;
      isMultiple = true;
    } else {
      return NextResponse.json(
        { error: 'Please provide transactionId, order_id, or user_id as a query parameter.' },
        { status: 400 }
      );
    }

    const result = isMultiple
      ? await Transaction.find(filter).sort({ createdAt: -1 })
      : await Transaction.findOne(filter);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return NextResponse.json({ status: 404, error: 'Transaction(s) not found.' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, transactions: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transaction(s):', error);
    revalidatePath(request.url);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
