"use client";
import { getOrderBasedOnStatus, updateOrder } from "@/app/api/order";
import { useEffect } from "react";

export default function OrderHistory() {
  useEffect(() => {
    const fetchData = async () => {
      // 50: restaurant ID
      // status: "in progress", "ready pick up", "done", "new" or put empty for all orders
      // get order based on status
      const orderData = await getOrderBasedOnStatus(50, "ready pick up");
      console.log(orderData);
    };
    fetchData();
  }, []);

  // TODO: assign the orderID into the button attribute ID
  const acceptOrder = async (event) => {
    await updateOrder(event.target.id, "in progress");
  };

  // TODO: assign the orderID into the button attribute ID
  const readyForPickUp = async (event) => {
    await updateOrder(event.target.id, "ready for pickup");
  };

  // TODO: assign the orderID into the button attribute ID
  const completeOrder = async (event) => {
    await updateOrder(event.target.id, "completed");
  };

  // TODO: assign the orderID into the button attribute ID
  const cancelOrder = async (event) => {
    await updateOrder(event.target.id, "cancelled");
  };

  return <p>Restaurant Order History Page</p>;
}
