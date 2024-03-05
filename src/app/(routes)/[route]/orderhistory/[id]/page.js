"use client";
import { useState, useEffect } from "react";
import { getOrderById } from "../../../../api/order";
import styles from "../../../../styles/RestaurantHomepage.module.scss";
import { getRestaurantByRoute } from "../../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams } from "next/navigation";
import { Button, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function OrderHistoryDetails() {
  const [orderHistoryDetails, setOrderHistoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderHistoryID, setorderHistoryID] = useState("");

  const params = useParams();
  const restaurantRoute = params.route;
  const [restaurantData, setRestaurantData] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    setTheme(styles.theme1); // Set page theme

    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
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
            const items = menuItems.filter((item) => item.categoryID == cat.id);
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items,
              image: items[0]?.imageURL, // use the first item's image
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
    localStorage.setItem("restaurant-route", restaurantRoute);
  }, [restaurantRoute]);

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

  function formatPrice(price) {
    var formattedPrice = parseFloat(price).toFixed(2);
    return "$" + formattedPrice;
  }

  return !checkEmail() ? (
    <div>
      <RestaurantAppBar restaurantInfo={restaurantData} />
      <p>You are not allowed to go to this page</p>
    </div>
  ) : (
    <div>
      <RestaurantAppBar restaurantInfo={restaurantData} />
      <Container maxWidth="xl">
        <Typography variant="h2" mb="15px" style={{ margin: "40px 0" }} align="center">Order History Detail</Typography>
        <Link href={`/${restaurantRoute}/orderhistory`} passHref>
          <Button
            variant="contained"
            sx={{
              mr: "2em",
              width: "15em",
              height: "3em",
              backgroundColor: (theme) =>
                `${theme.palette.primary.main} !important`,
              "&:hover": {
                backgroundColor: (theme) =>
                  `${theme.palette.primary.dark} !important`,
              },
            }}
          >
            Back to Order List
          </Button>
        </Link>
        {/*<Button
          variant="contained"
          sx={{
            width: "15em",
            height: "3em",
            backgroundColor: (theme) =>
              `${theme.palette.primary.main} !important`,
            "&:hover": {
              backgroundColor: (theme) =>
                `${theme.palette.primary.dark} !important`,
            },
          }}
        >
          Reorder
        </Button>*/}
        <Typography mt="15px" >Order Number: {orderHistoryID}</Typography>
        <Typography>Order Date: {orderHistoryDetails.time_placed}</Typography>
        <Typography variant="h3" mb="15px">Information</Typography>
        <Typography>Name: {orderHistoryDetails.users_permissions_user.fullname}</Typography>
        <Typography>Email: {orderHistoryDetails.users_permissions_user.data.attributes.email}</Typography>
        <Typography>Phone Number: {orderHistoryDetails.users_permissions_user.data.attributes.phonenumber}</Typography>
        <Typography mb="15px">Notes: {orderHistoryDetails.note}</Typography>
        <Container maxWidth="md">        
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Item Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistoryDetails.order_details.data.map((orderDetail, index) => (
                <TableRow key={orderDetail.attributes.menu_item.data.attributes.name}>
                  <TableCell align="center" >{orderDetail.attributes.quantity}</TableCell>
                  <TableCell align="center" >{orderDetail.attributes.menu_item.data.attributes.name}</TableCell>
                  <TableCell align="center" >{orderDetail.attributes.menu_item.data.attributes.description}</TableCell>
                  <TableCell align="center" >{formatPrice(orderDetail.attributes.menu_item.data.attributes.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer align="right">
          <TableRow>
            <TableCell colSpan={2} width="150em">Subtotal</TableCell>
            <TableCell align="right">{formatPrice(orderHistoryDetails.total_price)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} width="150em">Tax</TableCell>
            <TableCell align="right">{formatPrice(orderHistoryDetails.total_price * orderHistoryDetails.tax)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} width="150em">Total</TableCell>
            <TableCell align="right">{formatPrice(orderHistoryDetails.total_price + orderHistoryDetails.total_price * orderHistoryDetails.tax)}</TableCell>
          </TableRow>
        </TableContainer>

        </Container>
      </Container>
    </div>
  );
}
