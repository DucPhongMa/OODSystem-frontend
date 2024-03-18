"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrderByCustomer } from "../../../api/order";
import { Button, Container, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import Link from "next/link";
import styles from "../../../styles/RestaurantHomepage.module.scss";

import { getRouteAtom } from "../../../../../store";
import { useAtom } from "jotai";

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantRoute = params.route;

  const [restaurantData, setRestaurantData] = useState("");
  const [theme, setTheme] = useState("");

  //const [route, setRoute] = useAtom(getRouteAtom);
  if (typeof window !== 'undefined') {
    var route = localStorage.getItem("restaurant-route")
  } 
  
  useEffect(() => {
    setTheme(styles.theme1); // Set page theme

    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(route);
      try {
        const orderHistoryData = await getOrderByCustomer();
        setOrderHistory(orderHistoryData);
        setLoading(false);
      } catch (error) {
        setError("Fail to call the Order. Please Login!!!");
        setLoading(false);
      }

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
    //localStorage.setItem("restaurant-route", route);
  }, [route]);

  console.log("order History", orderHistory);
  const orderHistoryList = orderHistory
    ? orderHistory.map((order) => ({
        orderId: order.id,
        orderStatus: order.status,
        orderDate: order.time_placed,
        orderTotalPrice: order.total_price,
        restaurantName: order.restaurant.name,
      }))
    : [];

  const completedOrders = orderHistoryList.filter(
    (order) => order.orderStatus === "completed"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Order Data", completedOrders);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleString("default", options)
      .replace(",", "");
  };

  return (
    <div>
      <RestaurantAppBar restaurantInfo={restaurantData} />
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" style={{ margin: "40px 0" }}>
          Order History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width="200em">
                  Order #
                </TableCell>
                <TableCell align="center" width="400em">
                  Date
                </TableCell>
                <TableCell align="center" width="200em">
                  Status
                </TableCell>
                <TableCell align="center" width="150em">
                  Restaurant
                </TableCell>
                <TableCell align="center" width="150em">
                  Total Price
                </TableCell>
                <TableCell align="center" width="250em"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedOrders.map((order, index) => (
                <TableRow key={order.orderId}>
                  <TableCell align="center">{order.orderId}</TableCell>
                  <TableCell align="center">
                    {formatDate(order.orderDate)}
                  </TableCell>
                  <TableCell align="center">{order.orderStatus}</TableCell>
                  <TableCell align="center">{order.restaurantName}</TableCell>
                  <TableCell align="center">{order.orderTotalPrice}</TableCell>
                  <TableCell align="center">
                    <Link href={`orderhistory/${order.orderId}`} passHref>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main} !important`,
                          "&:hover": {
                            backgroundColor: (theme) =>
                              `${theme.palette.primary.dark} !important`,
                          },
                        }}
                      >
                        View
                      </Button>
                    </Link>
                    {/*<Button
                      variant="contained"
                      sx={{
                        ml: "2em",
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}
