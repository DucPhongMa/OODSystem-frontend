"use client";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../../store";
import { useState, useEffect } from "react";
import { checkCustomerLogin } from "@/app/api/auth";
import {
  TextField,
  Box,
  Paper,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import { addOrder } from "@/app/api/order";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams, useRouter } from "next/navigation";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import PickupLocation from "@/app/components/restaurant/PickupLocation";
import PickupDetails from "@/app/components/restaurant/PickupDetails";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import styles from "../../../styles/RestaurantCheckout.module.scss";

import { getCustomerNameAtom } from "../../../../../store";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const params = useParams();
  const restaurantRoute = params.route;
  const [openDialog, setOpenDialog] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState("open");
  const [unregisteredCustomerName, setUnregisteredCustomerName] =
    useAtom(getCustomerNameAtom);
  const [theme, setTheme] = useState("");

  const handleOpenDialog = async () => {
    event.preventDefault();
    if (!formData.customerName.trim()) {
      setErrorName(true);
      return;
    }
    if (!formData.phoneNum) {
      setErrorPhone(true);
      return;
    }
    if (!isValidPhoneNumber(formData.phoneNum)) {
      setErrorPhone(true);
      return;
    }
    console.log(cart);
    if (cart.length == 0) {
      alert("Cart is empty");
      return;
    }
    const status = await fetchStatus();
    console.log("status:", status);
    if (status != "open") {
      alert("The restaurant is not open for pickup now. ");
      return;
    }
    setOpenDialog(true);
  };

  const [formData, setFormData] = useState({
    phoneNum: "",
    customerName: "",
    additionalNotes: "",
    userId: null,
  });

  const getUserId = (token) => {
    // Split the token to get the payload part
    const base64UrlPayload = token.split(".")[1];

    // Decode the payload from Base64 URL encoding
    const base64Payload = base64UrlPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payload = decodeURIComponent(
      atob(base64Payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // Parse the payload as JSON and access the id
    const payloadData = JSON.parse(payload);
    const id = payloadData.id;

    console.log(id); // Should log the id, which is 56 in this case
    return id;
  };

  const [subTotal, setSubTotal] = useState(0);
  useEffect(() => {
    const customerInfo = checkCustomerLogin();
    if (customerInfo) {
      setFormData((currentFormData) => ({
        ...currentFormData,
        phoneNum: JSON.parse(customerInfo).phoneNum,
        customerName: JSON.parse(customerInfo).fullName,
        userId: getUserId(JSON.parse(customerInfo).value),
      }));
    }
  }, []);

  async function fetchStatus() {
    const restaurantData = await getRestaurantByRoute(restaurantRoute);
    setRestaurantStatus(restaurantData.attributes.status);
    return restaurantData.attributes.status;
  }

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
      setRestaurantStatus(restaurantData.attributes.status);
    }
    fetchMyAPI();
  }, [restaurantRoute]);

  useEffect(() => {
    const sTotal = cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
    setSubTotal(sTotal);
  }, [cart]);

  const isValidPhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  useEffect(() => {
    // Load cart data from localStorage on component mount
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const submitOrder = async () => {
    try {
      const orderItems = cart.map((item) => ({
        itemID: item.itemID,
        quantity: item.quantity,
        unit_price: item.price,
        menu_item: item.itemID,
        counter: item.counter,
        discount: item.discount,
      }));
      const uuid = uuidv4();
      setUnregisteredCustomerName(formData.customerName);
      await addOrder(
        uuid,
        orderItems,
        restaurantId,
        formData.additionalNotes,
        formData.customerName,
        formData.phoneNum,
        formData.userId
      );
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
      setOpenDialog(false); // Close the dialog after submission
      setCart([]);
      router.push(`/${restaurantRoute}/order/${uuid}`, { scroll: false });
    } catch (error) {
      console.error("Failed to submit order:", error);
      // Handle submission error
    }
  };

  const handleChangeName = (event) => {
    const value = event.target.value;
    setFormData({ ...formData, customerName: value });

    // Check if the value is empty or consists only of spaces
    if (!value.trim()) {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
  };

  return cart && cart.length > 0 ? (
    <div className={theme}>
      {!restaurantData && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantData == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {restaurantData && (
        <>
          <RestaurantAppBar data={restaurantData} />
          <Box
            sx={{ padding: 2 }}
            className={`${theme} ${styles.pageBackground}`}
          >
            {/* Address map */}
            {/* <PickupLocation
              address={restaurantData.restaurant_contact.address}
            /> */}

            {/* Name and phone number */}
            <Paper
              sx={{ marginBottom: 2, padding: 2 }}
              className={`${theme} ${styles.section}`}
            >
              <Typography variant="h6">PICKUP INFO</Typography>
              <TextField
                label="Customer Name"
                value={formData.customerName}
                onChange={handleChangeName}
                error={errorName}
                helperText={
                  errorName ? "Customer name cannot be empty or spaces." : ""
                }
                fullWidth
                margin="normal"
              />
              <br />
              <TextField
                label="Phone Number"
                value={formData.phoneNum}
                onChange={(event) => {
                  const value = event.target.value.trim();
                  const isValid = isValidPhoneNumber(value);

                  setFormData({
                    ...formData,
                    phoneNum: value,
                  });

                  setErrorPhone(!isValid);
                }}
                fullWidth
                margin="normal"
                inputProps={{
                  pattern: "d{10}",
                  title: "Phone number format: (123) 456-7890",
                }}
                error={errorPhone}
                helperText={errorPhone ? "Phone number must be 10 digits" : ""}
              />
            </Paper>

            {/* pickup details */}
            <PickupDetails cart={cart} subTotal={subTotal} theme={theme} />

            <Paper
              sx={{ marginBottom: 2, padding: 2 }}
              className={`${theme} ${styles.section}`}
            >
              <Typography variant="h6">Additional Notes</Typography>
              <TextField
                minRows={3}
                placeholder="You can put additional notes here"
                value={formData.additionalNotes}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    additionalNotes: event.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
            </Paper>
            <Typography variant="h5" sx={{ marginTop: 4, marginLeft: 2 }}>
              Pay in Person ${(subTotal * 1.13).toFixed(2)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
                marginTop: 5,
                width: "100%",
              }}
            >
              <Button
                onClick={handleOpenDialog}
                className={`${theme} ${styles.button}`}
              >
                PLACE PICKUP ORDER
              </Button>
            </Box>
          </Box>
          <RestaurantFooter restaurantData={restaurantData} />
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">
              {"Confirm Order Submission"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to submit this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={submitOrder} color="primary" autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  ) : (
    <div className={theme}>
      {restaurantData && (
        <>
          <RestaurantAppBar data={restaurantData} />
          <p>
            There are no items in cart. Please come back and add to cart first!!
          </p>
        </>
      )}
    </div>
  );
}
