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
  Paper,
  Box,
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import Link from "next/link";
import styles from "../../../styles/CustomerOrderHistory.module.scss";

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [theme, setTheme] = useState("");

  if (typeof window !== "undefined") {
    var route = JSON.parse(localStorage.getItem("restaurant-data")).route;
  }

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(route);

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
              image: items[0]?.imageURL,
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
  }, [route]);

  const orderHistoryList = orderHistory
    ? orderHistory.map((order) => {
        const taxRate = parseFloat(order.tax) || 0;
        const initialAccumulator = { subtotal: 0, totalDiscount: 0 };

        const { subtotal, totalDiscount } = order.order_details.reduce(
          (acc, detail) => {
            const itemPrice = parseFloat(detail.unit_price) || 0;
            const itemQuantity = parseInt(detail.quantity, 10) || 0;
            const itemDiscountPercent =
              parseFloat(detail.menu_item.discount) / 100 || 0;

            const itemSubtotal = itemPrice * itemQuantity;
            const itemDiscountAmount = itemSubtotal * itemDiscountPercent;

            acc.subtotal += itemSubtotal;
            acc.totalDiscount += itemDiscountAmount;

            return acc;
          },
          initialAccumulator
        );

        const adjustedSubtotal = subtotal - totalDiscount;
        const taxAmount = adjustedSubtotal * taxRate;
        const totalWithTax = adjustedSubtotal + taxAmount;

        return {
          orderId: order.id,
          orderStatus: order.status,
          orderDate: order.time_placed,
          orderTotalPrice: totalWithTax.toFixed(2),
          restaurantName: order.restaurant.name,
        };
      })
    : [];

  const completedOrders = orderHistoryList
    .filter(
      (order) =>
        order.orderStatus === "completed" || order.orderStatus === "cancelled"
    )
    .sort((a, b) => b.orderId - a.orderId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("completed orders: ", completedOrders);

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
    <div className={theme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box
          sx={{ flexGrow: 1 }}
          className={`${theme} ${styles.pageBackground}`}
        >
          <RestaurantAppBar data={restaurantData} />
          <Container maxWidth="xl">
            <Typography
              variant="h2"
              align="center"
              style={{ margin: "40px 0" }}
            >
              Order History
            </Typography>
            {completedOrders.length > 0 ? (
              <Paper
                sx={{ mb: 2, padding: 2 }}
                className={`${theme} ${styles.section}`}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        width="200em"
                        className={`${theme} ${styles.tableText}`}
                      >
                        Order #
                      </TableCell>
                      <TableCell
                        align="center"
                        width="400em"
                        className={`${theme} ${styles.tableText}`}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        align="center"
                        width="200em"
                        className={`${theme} ${styles.tableText}`}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="center"
                        width="150em"
                        className={`${theme} ${styles.tableText}`}
                      >
                        Restaurant
                      </TableCell>
                      <TableCell
                        align="center"
                        width="150em"
                        className={`${theme} ${styles.tableText}`}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        align="center"
                        width="250em"
                        className={`${theme} ${styles.tableText}`}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {completedOrders.map((order, index) => (
                      <TableRow key={order.orderId}>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          {order.orderId}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          {order.orderStatus}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          {order.restaurantName}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          ${order.orderTotalPrice}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${theme} ${styles.tableText}`}
                        >
                          <Link href={`orderhistory/${order.orderId}`} passHref>
                            <Button
                              variant="contained"
                              className={`${theme} ${styles.button}`}
                            >
                              DETAILS
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Typography>There are no completed orders.</Typography>
              </Box>
            )}
          </Container>
        </Box>
        <RestaurantFooter restaurantData={restaurantData} />
      </Box>
    </div>
  );
}
