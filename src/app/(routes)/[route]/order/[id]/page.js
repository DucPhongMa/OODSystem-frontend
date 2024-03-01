"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { getOrderByUUID, updateOrder } from "@/app/api/order";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams } from "next/navigation";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import PickupLocation from "@/app/components/restaurant/PickupLocation";
import PickupDetails from "@/app/components/restaurant/PickupDetails";

export default function Order() {
  const params = useParams();
  const restaurantRoute = params.route;
  const orderUUID = params.id;

  const [restaurantData, setRestaurantData] = useState(null);

  const [orderData, setOrderData] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmCancellation = async () => {
    await cancelOrder(); // Assuming this function updates the order status to 'cancelled'
    setOpenDialog(false);
    window.location.reload(); // Refresh the page
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        console.log(`Fetching order at ${new Date().toLocaleTimeString()}`); //
        const order = await getOrderByUUID(orderUUID);
        setOrderData(order);
        const transformedOrderDetails = order.attributes.order_details.data.map(
          (detail) => {
            // Assuming 'detail' represents each item in the 'order_details.data' array
            const menuItem = detail.attributes.menu_item.data.attributes;

            return {
              itemID: detail.attributes.menu_item.data.id, // Assuming you want the 'id' of the order detail as 'itemID'
              name: menuItem.name,
              price: menuItem.price,
              quantity: detail.attributes.quantity,
            };
          }
        );
        setOrderDetail(transformedOrderDetails);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    }

    fetchOrder();
    // Set up an interval to call fetchOrder every one minute (60000 milliseconds)
    const intervalId = setInterval(fetchOrder, 10000);

    // Clear the interval when the component unmounts
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      console.log("reload");
    };
  }, [orderUUID]); // Dependency array includes orderUUID to re-run the effect if it changes

  useEffect(() => {
    const sTotal = orderDetail
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
    setSubTotal(sTotal);
  }, [orderDetail]);

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      // setRestaurantId(restaurantData.id);
      const menuItems =
        restaurantData.attributes.menu.data.attributes.menu_items.data.map(
          (item) => {
            return {
              name: item.attributes.name,
              price: item.attributes.price,
              imageURL: item.attributes.imageURL,
              categoryID: item.attributes.menu_category.data.id,
              id: item.id,
              description: item.attributes.description,
            };
          }
        );
      const menuCate =
        restaurantData.attributes.menu.data.attributes.menu_categories.data.map(
          (cat) => {
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items: menuItems.filter((item) => item.categoryID == cat.id),
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
  }, [restaurantRoute]);

  const cancelOrder = async () => {
    updateOrder(orderData.id, "cancelled");
    // updateOrder(23, "in progress");
  };

  return (
    <>
      {(!restaurantData || !orderData) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantData == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {restaurantData && orderData && (
        <>
          <RestaurantAppBar restaurantInfo={restaurantData} />
          {/* order status */}
          <Paper sx={{ marginBottom: 2, padding: 2 }}>
            <Typography
              variant="h6"
              align="center"
              sx={{ backgroundColor: "grey" }}
            >
              ORDER PLACED!
            </Typography>
            <Typography variant="h5" sx={{ marginTop: "20px" }}>
              ORDER STATUS
            </Typography>
            {orderData.attributes.status == "pending" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Pending
                </Typography>
                <Typography variant="h8" sx={{ paddingTop: "50px" }}>
                  Waiting for the restaurant to accept your order...
                </Typography>
                <Box
                  sx={{
                    marginBottom: 2,
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    // onClick={cancelOrder}
                    onClick={handleCancelClick}
                  >
                    CANCEL ORDER
                  </Button>
                </Box>
              </>
            )}
            {orderData.attributes.status == "in progress" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  In Progress
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Your Order Number: {orderData.id}
                </Typography>
                <Typography variant="h8" sx={{ paddingTop: "50px" }}>
                  Your order is being prepared.
                  <br />
                  Your order cannot be changed at this time. Please call{" "}
                  {restaurantData.restaurant_contact?.phone} for inquiries.
                </Typography>
              </>
            )}
            {orderData.attributes.status == "ready for pick up" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Ready for Pick Up
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Your Order Number: {orderData.id}
                </Typography>
                <Typography variant="h8" sx={{ paddingTop: "50px" }}>
                  Your order is ready for pick up.
                  <br />
                  Your order cannot be changed at this time. Please call{" "}
                  {restaurantData.restaurant_contact?.phone} for inquiries.
                </Typography>
              </>
            )}
            {orderData.attributes.status == "completed" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Completed
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Your Order Number: {orderData.id}
                </Typography>
                <Typography variant="h8" sx={{ paddingTop: "50px" }}>
                  Your order is completed.
                  <br />
                  Your order cannot be changed at this time. Please call{" "}
                  {restaurantData.restaurant_contact?.phone} for inquiries.
                </Typography>
                <Box
                  sx={{
                    marginBottom: 2,
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    // onClick={addReview}
                  >
                    LEAVE REVIEW
                  </Button>
                </Box>
              </>
            )}
            {orderData.attributes.status == "cancelled" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Cancelled
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Your Order Number: {orderData.id}
                </Typography>
                <Typography variant="h8" sx={{ paddingTop: "50px" }}>
                  Your order is cancelled.
                  <br />
                  Please call {restaurantData.restaurant_contact?.phone} for
                  inquiries.
                </Typography>
                <Box
                  sx={{
                    marginBottom: 2,
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    // onClick={addReview}
                  >
                    LEAVE REVIEW
                  </Button>
                </Box>
              </>
            )}
          </Paper>

          <Box sx={{ padding: 2 }}>
            {/* Address map */}
            {/* {orderData.attributes.status != "pending" && (
              <PickupLocation
                address={restaurantData.restaurant_contact.address}
              />
            )} */}

            {/* pickup details */}
            <PickupDetails cart={orderDetail} subTotal={subTotal} />

            <Typography variant="h6">
              Pay in Person ${(subTotal * 1.13).toFixed(2)}
            </Typography>
          </Box>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Cancel Order"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this order?
                <br />
                <br />
                Please call {restaurantData.restaurant_contact?.phone} for
                inquiries.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>No</Button>
              <Button onClick={handleConfirmCancellation} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
