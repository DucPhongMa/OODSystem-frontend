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
  Rating,
  Box,
  Paper,
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import Link from "next/link";
import styles from "../../../styles/RestaurantReviews.module.scss";
import { getAllReviews } from "../../../api/review";

export default function OrderHistory() {
  //const [orderHistory, setOrderHistory] = useState(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantRoute = params.route;

  const [restaurantData, setRestaurantData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);

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
        const ReviewData = await getAllReviews(restaurantRoute);

        const sortedReviewData = ReviewData.slice().sort((a, b) => b.id - a.id);

        setReviewData(sortedReviewData);
        setLoading(false);
      } catch (error) {
        setError("Fail to call the Order!!!");
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
    localStorage.setItem("restaurant-route", restaurantRoute);
  }, [restaurantRoute]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("All Reviews: ", reviewData);

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
      <Box className={`${theme} ${styles.pageBackground}`}>
        <RestaurantAppBar data={restaurantData} />
        <Container maxWidth="xl" sx={{ marginBottom: 12 }}>
          <Typography variant="h2" align="center" style={{ margin: "40px 0" }}>
            Reviews
          </Typography>
          <Paper
            sx={{ marginBottom: 2, padding: 2 }}
            className={`${theme} ${styles.section}`}
          >
            <Table>
              <TableBody>
                {reviewData.map((review, index) => (
                  <TableRow key={review.id}>
                    <TableCell
                      align="center"
                      className={`${theme} ${styles.tableText}`}
                    >
                      {review.attributes.customerName != "" &&
                        review.attributes.customerName}{" "}
                      {review.attributes.customerName == "" && "Guest"}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={`${theme} ${styles.tableText}`}
                    >
                      <Rating
                        value={review.attributes.rating}
                        readOnly
                      ></Rating>
                    </TableCell>
                    <TableCell
                      align="center"
                      className={`${theme} ${styles.tableText}`}
                    >
                      {review.attributes.reviewContent}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={`${theme} ${styles.tableText}`}
                    >
                      {formatDate(review.attributes.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
        <RestaurantFooter restaurantData={restaurantData} />
      </Box>
    </div>
  );
}
