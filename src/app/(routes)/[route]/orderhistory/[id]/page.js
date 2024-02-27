"use client";
import { useState, useEffect } from "react";
import { getOrderById } from "../../../../api/order";

export default function OrderHistoryDetails() {
  const [orderHistoryDetails, setOrderHistoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistoryID, setorderHistoryID] = useState("");

  useEffect(() => {
    async function fetchMyAPI() {
      try {
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();
        const orderHistoryDetailsData = await getOrderById(id);
        setOrderHistoryDetails(orderHistoryDetailsData);
        setorderHistoryID(id);
        setLoading(false);
      } catch (error) {
        setError("Fail to call the Order Detail. Please Login!!!");
        setLoading(false);
      }
    }

    fetchMyAPI();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("order Detail History", orderHistoryDetails);

  const storedUsername = localStorage.getItem("username");

  function checkEmail() {
    if (
      storedUsername !=
      orderHistoryDetails.users_permissions_user.data.attributes.email
    ) {
      return false;
    }
    return true;
  }

  return !checkEmail() ? (
    <div>
      <p>You are not allowed to go to this page</p>
    </div>
  ) : (
    <div>
      {/* Base on the values inside {}. Do Styling to make it the same as the wireframe*/}
      <p>{orderHistoryID}</p>
      <p>{orderHistoryDetails.time_placed}</p>
      <br />
      <h1>Customer Information</h1>
      <p>
        {orderHistoryDetails.users_permissions_user.data.attributes.fullname}
      </p>
      <p>{orderHistoryDetails.users_permissions_user.data.attributes.email}</p>
      <p>
        {orderHistoryDetails.users_permissions_user.data.attributes.phonenumber}
      </p>

      <h1>Order Details</h1>
      {orderHistoryDetails.order_details.data.map((orderDetail, index) => (
        <div key={index}>
          <p>Quantity: {orderDetail.attributes.quantity}</p>
          <p>Name: {orderDetail.attributes.menu_item.data.attributes.name}</p>
          <p>
            Description:{" "}
            {orderDetail.attributes.menu_item.data.attributes.description}
          </p>
          <p>Price: {orderDetail.attributes.menu_item.data.attributes.price}</p>

          <br />
        </div>
      ))}
      <p>====================================================</p>
      <br />

      <p>total_price: {orderHistoryDetails.total_price}</p>
      <p>
        total_price_with_tax:{" "}
        {orderHistoryDetails.total_price +
          orderHistoryDetails.total_price * orderHistoryDetails.tax}
      </p>
    </div>
  );
}
