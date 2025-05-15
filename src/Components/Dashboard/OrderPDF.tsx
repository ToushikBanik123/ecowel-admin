// components/OrderPDF.tsx
"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// const OrderPDF = ({ order }: { order: any }) => {
export const generatePDF = (order: any, product: any) => {
  console.log("order", product);

  const doc = new jsPDF();

  // 🏢 Company Branding
  doc.setFontSize(18);
  doc.text("Ecowell", 10, 15);
  doc.setFontSize(12);
  doc.text("Order Invoice", 10, 23);
  doc.line(10, 25, 200, 25); // horizontal line

  // 📄 Order & Customer Info
  const details = [
    [`Order ID`, order.order_id],
    [`Status`, order.status],
    [`Order Date`, new Date(order.order_date).toLocaleString()],
    [
      `Customer Name`,
      `${order?.first_name || order?.firstName} ${
        order.last_name || order.lastName
      }`,
    ],
    [`Phone`, order.phone],
    [`Alternative No`, order.altPhone || "N/A"],
    [`Email`, order.email],
    [`Address Line 1`, order.addressLine1],
    [`Address Line 2`, order.addressLine2],
    [`Landmark`, order.landmark],
    [`City`, order.city],
    [`State`, order.state],
    [`Country`, order.country],
    [`Pincode`, order.pincode || order.postalCode],
    [`Payment Method`, order.payment_method.toUpperCase()],
  ];

  let y = 30;
  details.forEach(([label, value]) => {
    doc.text(`${label}:`, 10, y);
    doc.text(`${value}`, 60, y);
    y += 8;
  });

  // 🧾 Product Table (dummy example — replace with actual order items)
  const products = product || [];

  const tableData = products.map((p: any, index: number) => [
    index + 1,
    p?.title,
    p?.variant_flavor,
    p?.quantity,
    `${p?.price}`,
    `${p?.salePrice}`,
    `${p?.discount.toFixed()}`,
    `${p?.quantity * p?.salePrice}`,
  ]);

  autoTable(doc, {
    startY: y + 5,
    head: [
      [
        "#",
        "Product",
        "Flavor",
        "Qty",
        "Price",
        "Sale Price",
        "Discount",
        "Total",
      ],
    ],
    body: tableData,
  });

  // 💰 Total Price
  const totalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Grand Total: ${order.total_price}`, 140, totalY);

  // 📥 Save PDF
  doc.save(`${order.order_id}.pdf`);
};

// export default OrderPDF;
