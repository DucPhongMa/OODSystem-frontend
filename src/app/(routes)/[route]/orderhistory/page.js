'use client';
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation"
import { getOrderByCustomer } from '../../../api/order';
import { Button } from "@mui/material";
import Link from "next/link";

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState(null);
  const params = useParams()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantRoute = params.route

  useEffect(() => {
    async function fetchMyAPI() {
      try{
        const orderHistoryData = await getOrderByCustomer();
        setOrderHistory(orderHistoryData);
        setLoading(false);
      }catch (error) {
        setError("Fail to call the Order. Please Login!!!");
        setLoading(false);
      }
    }   

    fetchMyAPI();
  }, []);

  console.log("order History", orderHistory);
  const orderHistoryList = orderHistory ? orderHistory.map(order => ({
    orderId: order.id,
    orderStatus: order.status,
    orderDate: order.time_placed,
    orderTotalPrice: order.total_price
  })) : [];
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Order Data", orderHistoryList);
  return (
    <div>
      <h1>This is the order history page</h1>
      {orderHistoryList && orderHistoryList.map((order, index) => (
        <div key={index}>
          {/* Based on the example below, create a table with the list of orders*/}
          <p>Order ID: {order.orderId}</p>
          <p>Order Date: {order.orderDate}</p>
          <p>Order Status: {order.orderStatus}</p>
          <p>Order Total Price: {order.orderTotalPrice}</p>
          <Link href={`orderhistory/${order.orderId}`} passHref>
          <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      "&:hover": {
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.dark} !important`,
                      },
                    }}
                    fullWidth
                  >
                    View
                  </Button>
          </Link>
          <br />
        </div>
      ))}
    </div>
  );
}
