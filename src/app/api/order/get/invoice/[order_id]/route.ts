import { NextResponse } from 'next/server';
// import PDFDocument from 'pdfkit';
import { connectToMongoDB } from "@/lib/db";
import Order from "@/models/Order";
import path from 'path';
import Products from "@/models/Products";
import ShippingAddress from '@/models/ShippingAddress';

interface OrderInfo {
    order_id: string;
    payment_method: string;
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
    status: string;
    shipping_address_id: string;
}

interface ProductItem {
    variant_flavor: string;
    quantity: number;
}

interface Order {
    order_info: OrderInfo;
    products: ProductItem[];
}


// Fetch an order by its ID from MongoDB
async function getOrder(order_id: string): Promise<Order | null> {
    await connectToMongoDB();
  
    const orderDoc = await Order.findOne({
      'orders.order_info.order_id': order_id
    }).lean();
  
    if (!orderDoc) return null;
  
    // Assuming your Order model has an 'orders' field which is an array
    // @ts-ignore  
    const order = orderDoc?.orders?.find( 
        (o: any) => o?.order_info?.order_id === order_id
    );
  
    if (!order) return null;
  
    const { shipping_address_id } = order.order_info;
    if (shipping_address_id) {
      const address = await ShippingAddress
        .findById(shipping_address_id)
        .lean();
  
      order.order_info = { ...order.order_info, ...address };
    }
  
    return order || null;
  }

// Generate a PDF invoice for the given order
// async function generateInvoice(order: Order): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument({ size: 'A4', margin: 50 });
//         const chunks: Uint8Array[] = [];

//         // Register your own font file
//         const fontPath = path.resolve('src', 'assets', 'fonts', 'Roboto-Regular.ttf');
//         doc.registerFont('Roboto', fontPath);
//         doc.font('Roboto');

//         doc.on('data', (chunk) => chunks.push(chunk));
//         doc.on('end', () => resolve(Buffer.concat(chunks)));
//         doc.on('error', reject);

//         // Header
//         doc.fontSize(20).text('Invoice', { align: 'center' });
//         doc.moveDown();

//         // Order Info
//         doc.fontSize(12).text(`Order ID: ${order.order_info.order_id}`);
//         doc.text(`Date: ${order.order_info.order_date.toDateString()}`);
//         doc.text(`Status: ${order.order_info.status}`);
//         doc.moveDown();

//         // Billing info
//         doc.text(`Name: ${order.order_info.first_name} ${order.order_info.last_name}`);
//         doc.text(`Email: ${order.order_info.email}`);
//         doc.text(`Phone: ${order.order_info.phone}`);
//         doc.text(`Address: ${order.order_info.address}, ${order.order_info.city}, ${order.order_info.state}, ${order.order_info.country} - ${order.order_info.pincode}`);
//         doc.moveDown();

//         // Products List
//         doc.text('Products:', { underline: true });
//         order.products.forEach((p, idx) => {
//             doc.text(`${idx + 1}. Flavor: ${p.variant_flavor}, Quantity: ${p.quantity}`);
//         });
//         doc.moveDown();

//         // Total
//         doc.text(`Total Price: ₹${order.order_info.total_price}`, { align: 'right' });

//         doc.end();
//     });
// }

// /api/invoice/[order_id]
export async function GET(
    _request: Request,
    { params }: { params: { order_id: string } }
) {
    try {
        const { order_id } = params;
        const order = await getOrder(order_id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const productDetails = await Promise.all(
            order.products.map(async (product) => {

                const productData = await Products.findById((product as any)?.product_id, {
                    title: 1,
                    sku: 1,
                    description: 1,
                    price: 1,
                    salePrice: 1,
                    discount: 1,
                });

                return {
                    ...productData.toObject(),
                    variant_flavor: product.variant_flavor,
                    quantity: product.quantity,
                };
            })
        );

        // const pdfBuffer = await generateInvoice(order);

        // // Set headers for PDF download
        // return new NextResponse(pdfBuffer, {
        //     status: 200,
        //     headers: {
        //         'Content-Type': 'application/pdf',
        //         'Content-Disposition': `attachment; filename=invoice-${order_id}.pdf`
        //     }
        // });
        return NextResponse.json(
            {
                status: 1,
                message: 'Order found',
                order: order,
                productDetails: productDetails,
            },
            { status: 200 });
    } catch (error) {
        console.error("Error generating invoice:", error);
        return NextResponse.json({ error: 'Failed to generate invoice', status: 0 }, { status: 500 });
    }
}
