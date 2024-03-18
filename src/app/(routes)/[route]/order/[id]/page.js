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
  Modal,
  TextField,
  Grid,
  Rating,
  Container,
} from "@mui/material";

import { getOrderByUUID, updateOrder } from "@/app/api/order";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams } from "next/navigation";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import PickupLocation from "@/app/components/restaurant/PickupLocation";
import PickupDetails from "@/app/components/restaurant/PickupDetails";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";

export default function Order() {
  const params = useParams();
  const restaurantRoute = params.route;
  const orderUUID = params.id;

  const [restaurantData, setRestaurantData] = useState(null);

  const [orderData, setOrderData] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [rating, setRating] = useState(2.5);
  const [reviewText, setReviewText] = useState(null);

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

  const handleSubmitReview = async () => {
    console.log(rating);
    console.log(reviewText);

    handleClose();
    setReviewSubmitted(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Get the year, month, and day
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert 24h time to 12h time
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format the time
    const time = hours + ":" + minutes + ampm;

    // Combine the date and time
    return `${year}-${month}-${day} ${time}`;
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
              categoryID: item.attributes.menu_category.data?.id,
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
                  Estimated pick up time:{" "}
                  {formatDate(orderData.attributes?.time_estimated)}
                  .
                  <br />
                  Your order cannot be changed at this time. Please call{" "}
                  {restaurantData.restaurant_contact?.phone} for inquiries.
                </Typography>
              </>
            )}
            {orderData.attributes.status == "ready for pickup" && (
              <>
                <Typography variant="h6" sx={{ marginTop: "30px" }}>
                  Ready for Pick Up. Address:{" "}
                  {restaurantData.restaurant_contact?.address}
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
                    onClick={handleOpen}
                    disabled={reviewSubmitted}
                  >
                    {!reviewSubmitted && <>LEAVE REVIEW</>}
                    {reviewSubmitted && <>REVIEW SUBMITTED</>}
                  </Button>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "50em",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <TextField
                        id="outlined-multiline-static"
                        label="Write your thoughts here (max 300 characters)"
                        multiline
                        fullWidth
                        inputProps={{ maxLength: 300 }}
                        onChange={(event) => setReviewText(event.target.value)}
                        rows={4}
                        sx={{ marginBottom: "2em" }}
                      />
                      <Container>
                        <Grid container>
                          <Grid item xs={6}>
                            <Rating
                              defaultValue={rating}
                              precision={0.5}
                              onChange={(event, newValue) => {
                                setRating(newValue);
                              }}
                              size="large"
                            />
                          </Grid>
                          <Grid item xs={6} textAlign="right">
                            <Button
                              onClick={handleSubmitReview}
                              variant="outlined"
                              color="primary"
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>
                  </Modal>
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
                    onClick={handleOpen}
                    disabled={reviewSubmitted}
                  >
                    {!reviewSubmitted && <>LEAVE REVIEW</>}
                    {reviewSubmitted && <>REVIEW SUBMITTED</>}
                  </Button>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "50em",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <TextField
                        id="outlined-multiline-static"
                        label="Write your thoughts here (max 300 characters)"
                        multiline
                        fullWidth
                        inputProps={{ maxLength: 300 }}
                        onChange={(event) => setReviewText(event.target.value)}
                        rows={4}
                        sx={{ marginBottom: "2em" }}
                      />
                      <Container>
                        <Grid container>
                          <Grid item xs={6}>
                            <Rating
                              defaultValue={rating}
                              precision={0.5}
                              onChange={(event, newValue) => {
                                setRating(newValue);
                              }}
                              size="large"
                            />
                          </Grid>
                          <Grid item xs={6} textAlign="right">
                            <Button
                              onClick={handleSubmitReview}
                              variant="outlined"
                              color="primary"
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>
                  </Modal>
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
          <RestaurantFooter restaurantData={restaurantData} />
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
