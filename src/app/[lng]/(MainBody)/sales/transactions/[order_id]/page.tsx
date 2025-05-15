"use client";
import SalesTransaction from "@/Components/Sales/SalesTransaction";
import { useParams } from "next/navigation";

const SalesTransactionContainer = () => {
  const params = useParams();
  const order_id = params.order_id as string | undefined;

  return <SalesTransaction order_id={order_id}/>;
};

export default SalesTransactionContainer;
