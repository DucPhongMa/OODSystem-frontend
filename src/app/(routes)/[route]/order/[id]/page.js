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
  Alert,
} from "@mui/material";
import { getOrderByUUID, updateOrder } from "@/app/api/order";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams } from "next/navigation";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import PickupLocation from "@/app/components/restaurant/PickupLocation";
import PickupDetails from "@/app/components/restaurant/PickupDetails";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import WaitingText from "@/app/components/restaurant/WaitingText";
import { checkCustomerLogin } from "@/app/api/auth";
import { getCustomerNameAtom } from "../../../../../../store";
import { useAtom } from "jotai";
import { addReviews } from "@/app/api/review";
import styles from "../../../../styles/RestaurantCheckout.module.scss";

export default function Order() {
  const params = useParams();
  const restaurantRoute = params.route;
  const orderUUID = params.id;

  const [theme, setTheme] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

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

  const [unregisteredCustomerName, setUnregisteredCustomerName] =
    useAtom(getCustomerNameAtom);

  const handleCancelClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmCancellation = async () => {
    await cancelOrder();
    setOpenDialog(false);
    window.location.reload();
  };

  const handleSubmitReview = async () => {
    const customerInfo = checkCustomerLogin();

    let customerName = "";
    if (customerInfo) {
      customerName = JSON.parse(customerInfo).fullName;
    } else {
      customerName = unregisteredCustomerName;
    }
    console.log("Customer Name: ", customerName);
    console.log(rating);
    console.log(reviewText);
    console.log("Restaurant ID: ", restaurantId);
    await addReviews(customerName, rating, reviewText, restaurantId);

    handleClose();
    setReviewSubmitted(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const time = hours + ":" + minutes + ampm;

    return `${year}-${month}-${day} ${time}`;
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        console.log(`Fetching order at ${new Date().toLocaleTimeString()}`); //
        const order = await getOrderByUUID(orderUUID);
        setOrderData(order);
        console.log(order);
        const transformedOrderDetails = order.attributes.order_details.data.map(
          (detail) => {
            // Assuming 'detail' represents each item in the 'order_details.data' array
            const menuItem = detail.attributes.menu_item.data.attributes;

            return {
              itemID: detail.attributes.menu_item.data.id, // Assuming you want the 'id' of the order detail as 'itemID'
              name: menuItem.name,
              price: menuItem.price,
              quantity: detail.attributes.quantity,
              discount: menuItem.discount,
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
      console.log(restaurantData);

      const themeID = restaurantData.attributes.theme.id;

      // Set the page theme based on the themeID
      switch (themeID) {
        case 1:
          setTheme(styles.theme1);
          break;
        case 2:
          setTheme(styles.theme2);
          break;
        case 3:
          setTheme(styles.theme3);
          break;
        default:
          setTheme(styles.theme1);
      }

      setRestaurantId(restaurantData.id);
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
              discount: item.attributes.discount,
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
    <div className={theme}>
      {(!restaurantData || !orderData) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantData == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {restaurantData && orderData && (
        <Box className={`${theme} ${styles.pageBackground}`}>
          <RestaurantAppBar data={restaurantData} />
          {orderData.attributes.status == "pending" && (
            <>
              <Alert
                severity="success"
                className={`${theme} ${styles.placedAlert}`}
              >
                ORDER PLACED!
              </Alert>
              <Box sx={{ marginLeft: 4 }}>
                <Typography
                  sx={{ marginTop: 4, marginBottom: 2 }}
                  className={`${theme} ${styles.orderStatusText}`}
                >
                  ORDER STATUS
                </Typography>
                <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
                  Pending
                </Typography>
                <WaitingText />
                <Box sx={{ marginTop: 3, marginBottom: 2 }}>
                  <Button
                    onClick={handleCancelClick}
                    className={`${theme} ${styles.trackingPageButton}`}
                  >
                    CANCEL ORDER
                  </Button>
                </Box>
              </Box>
            </>
          )}
          {orderData.attributes.status == "in progress" && (
            <Box sx={{ marginLeft: 4 }}>
              <Typography
                sx={{ marginTop: 4, marginBottom: 2 }}
                className={`${theme} ${styles.orderStatusText}`}
              >
                ORDER STATUS
              </Typography>
              <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
                In Progress
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Order #{orderData.id}&nbsp; for&nbsp;{" "}
                {orderData.attributes.username}
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 3, marginBottom: 2, display: "block" }}
              >
                Your order is being prepared.
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 2, marginBottom: 2, display: "block" }}
              >
                Estimated pick up time:{" "}
                {formatDate(orderData.attributes?.time_estimated)}.
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 1, marginBottom: 3, display: "block" }}
              >
                Your order cannot be changed at this time. Please call{" "}
                {restaurantData.restaurant_contact?.phone} for inquiries.
              </Typography>
            </Box>
          )}
          {orderData.attributes.status == "ready for pickup" && (
            <Box sx={{ marginLeft: 4 }}>
              <Typography
                sx={{ marginTop: 4, marginBottom: 2 }}
                className={`${theme} ${styles.orderStatusText}`}
              >
                ORDER STATUS
              </Typography>
              <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
                Ready for Pick Up
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Order #{orderData.id}&nbsp; for&nbsp;{" "}
                {orderData.attributes.username}
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 1, marginBottom: 2, display: "block" }}
              >
                Your order is ready for pick up at:
              </Typography>
              <Typography variant="h8" sx={{ marginTop: 1, display: "block" }}>
                {restaurantData.name}
              </Typography>
              <Typography variant="h8" sx={{ display: "block" }}>
                {restaurantData.restaurant_contact?.address}
              </Typography>
              <Typography variant="h8" sx={{ display: "block" }}>
                {restaurantData.restaurant_contact?.city},{" "}
                {restaurantData.restaurant_contact?.provinceOrState}
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginBottom: 1, display: "block" }}
              >
                {restaurantData.restaurant_contact?.postalCode}
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 2, marginBottom: 3, display: "block" }}
              >
                Your order cannot be changed at this time. Please call{" "}
                {restaurantData.restaurant_contact?.phone} for inquiries.
              </Typography>
            </Box>
          )}
          {orderData.attributes.status == "completed" && (
            <Box sx={{ marginLeft: 4 }}>
              <Typography
                sx={{ marginTop: 4, marginBottom: 2 }}
                className={`${theme} ${styles.orderStatusText}`}
              >
                ORDER STATUS
              </Typography>
              <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
                Completed
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Order #{orderData.id}&nbsp; for&nbsp;{" "}
                {orderData.attributes.username}
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 3, marginBottom: 2, display: "block" }}
              >
                Your order is completed.
              </Typography>
              <Typography
                variant="h8"
                sx={{ marginTop: 1, marginBottom: 3, display: "block" }}
              >
                Please call {restaurantData.restaurant_contact?.phone} for
                inquiries.
              </Typography>
              <Box
                sx={{
                  marginBottom: 1,
                  marginTop: 3,
                }}
              >
                <Button
                  onClick={handleOpen}
                  disabled={reviewSubmitted}
                  className={`${theme} ${styles.trackingPageButton}`}
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
            </Box>
          )}
          {orderData.attributes.status == "cancelled" && (
            <>
              <Alert
                severity="warning"
                className={`${theme} ${styles.cancelledAlert}`}
              >
                ORDER CANCELLED
              </Alert>
              <Box sx={{ marginLeft: 4 }}>
                <Typography
                  sx={{ marginTop: 4, marginBottom: 2 }}
                  className={`${theme} ${styles.orderStatusText}`}
                >
                  ORDER STATUS
                </Typography>
                <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
                  Cancelled
                </Typography>
                <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                  Order #{orderData.id}&nbsp; for&nbsp;{" "}
                  {orderData.attributes.username}
                </Typography>
                <Typography
                  variant="h8"
                  sx={{ marginTop: 3, marginBottom: 2, display: "block" }}
                >
                  Your order has been cancelled.
                </Typography>
                <Typography
                  variant="h8"
                  sx={{ marginTop: 1, marginBottom: 3, display: "block" }}
                >
                  Please call {restaurantData.restaurant_contact?.phone} for
                  inquiries.
                </Typography>
              </Box>
            </>
          )}

          <Box sx={{ padding: 2 }}>
            {/* Address map */}
            {/* {orderData.attributes.status != "pending" && (
              <PickupLocation
                address={restaurantData.restaurant_contact.address}
              />
            )} */}

            {/* pickup details */}
            <PickupDetails
              cart={orderDetail}
              subTotal={subTotal}
              theme={theme}
            />

            <Typography
              variant="h5"
              sx={{ marginTop: 4, marginLeft: 2, marginBottom: 10 }}
            >
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
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>No</Button>
              <Button onClick={handleConfirmCancellation} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
}
