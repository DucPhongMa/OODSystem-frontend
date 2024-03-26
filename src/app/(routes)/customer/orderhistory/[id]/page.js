"use client";
import { useState, useEffect } from "react";
import { getOrderById } from "../../../../api/order";
import styles from "../../../../styles/CustomerOrderHistoryDetails.module.scss";
import { getRestaurantByRoute } from "../../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import { useParams } from "next/navigation";
import { Button, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

export default function OrderHistoryDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState("");
  const params = useParams();
  const [restaurantData, setRestaurantData] = useState(null);
  const [theme, setTheme] = useState("");

  //const [route, setRoute] = useAtom(getRouteAtom);
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
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();
        const order = await getOrderById(id);

        const taxRate = parseFloat(order.tax) || 0;
        const initialAccumulator = { subtotal: 0, totalDiscount: 0 };

        const { subtotal, totalDiscount } = order.order_details.data.reduce(
          (acc, detail) => {
            const itemPrice = parseFloat(detail.attributes.unit_price) || 0;
            const itemQuantity = parseInt(detail.attributes.quantity, 10) || 0;
            const itemDiscountPercent =
              parseFloat(detail.attributes.menu_item.data.attributes.discount) /
                100 || 0;

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

        const formattedOrder = {
          id: id,
          email: order.users_permissions_user.data.attributes.email,
          createdAt: order.createdAt,
          dateTime: order.time_placed,
          note: order.note,
          details: order.order_details.data.map((detail) => ({
            id: detail.id,
            name:
              detail.attributes.menu_item.data?.attributes.name ??
              "Unknown Item",
            quantity: detail.attributes.quantity,
            unitPrice: detail.attributes.unit_price,
          })),
          status: order.status,
          subtotal: subtotal,
          totalDiscount: totalDiscount,
          tax: taxAmount,
          totalPrice: totalWithTax,
          customer: order.username ?? "N/A",
          phoneNumber: order.phone_number,
          timeCompleted: order.time_completed,
        };

        setOrder(formattedOrder);
        console.log("parsed order: ", formattedOrder);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const storedUsername = localStorage.getItem("customer-username");

  function checkEmail() {
    if (storedUsername != order.email) {
      return false;
    }
    return true;
  }

  function formatPrice(price) {
    var formattedPrice = parseFloat(price).toFixed(2);
    return "$" + formattedPrice;
  }

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
          {!checkEmail() ? (
            <Typography
              variant="h5"
              sx={{ marginTop: "20px", textAlign: "center" }}
            >
              You are not allowed to go to this page
            </Typography>
          ) : (
            <>
              <RestaurantAppBar data={restaurantData} />
              <Container maxWidth="xl">
                <Link href={`/customer/orderhistory`} passHref>
                  <Button
                    variant="contained"
                    sx={{
                      mr: "2em",
                      width: "15em",
                      height: "3em",
                      marginTop: 3,
                      marginBottom: 4,
                    }}
                    className={`${theme} ${styles.button}`}
                  >
                    Back to Orders
                  </Button>
                </Link>
                <Typography
                  variant="h5"
                  align="left"
                  sx={{
                    mb: 3,
                  }}
                >
                  Order #{order.id}&nbsp; for&nbsp; {order.customer} (
                  {order.phoneNumber})
                </Typography>
                <Typography mb="15px">
                  Order Date: {formatDate(order.dateTime)}
                </Typography>

                <Typography mb="15px">Notes: {order.note}</Typography>
                <Container maxWidth="md">
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="right"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >

                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            Item
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.details.map((item, index) => (
                          <TableRow key={item.name}>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "1rem" }}
                              className={`${theme} ${styles.tableText}`}
                            >
                              {item.quantity} x
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ fontSize: "1rem" }}
                              className={`${theme} ${styles.tableText}`}
                            >
                              {item.name}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "1rem" }}
                              className={`${theme} ${styles.tableText}`}
                            >
                              {formatPrice(item.unitPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>

                      <TableFooter>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            width="150em"
                            sx={{ fontSize: "1rem" }}
                            align="right"
                            className={`${theme} ${styles.tableText}`}
                          >
                            Subtotal
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            {formatPrice(order.subtotal)}
                          </TableCell>
                        </TableRow>
                        {order.totalDiscount > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              width="150em"
                              sx={{ fontSize: "1rem" }}
                            >
                              Total Discount
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "1rem" }}
                              className={`${theme} ${styles.tableText}`}
                            >
                              − {formatPrice(order.totalDiscount)}
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell
                            align="right"
                            colSpan={2}
                            width="150em"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            Tax
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            {formatPrice(order.tax)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            align="right"
                            colSpan={2}
                            width="150em"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: "1rem" }}
                            className={`${theme} ${styles.tableText}`}
                          >
                            {formatPrice(order.totalPrice)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Container>
              </Container>
            </>
          )}
        </Box>
        <RestaurantFooter restaurantData={restaurantData} />
      </Box>
    </div>
  );
}
