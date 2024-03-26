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
  Rating
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import Link from "next/link";
import styles from "../../../styles/RestaurantHomepage.module.scss";
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
    setTheme(styles.theme1); // Set page theme

    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      try {
        const ReviewData = await getAllReviews(restaurantRoute);

        const sortedReviewData = ReviewData.slice().sort((a, b) => a.id - b.id);
        
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
    <div>
      <RestaurantAppBar data={restaurantData} />
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" style={{ margin: "40px 0" }}>
          Reviews
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width="200em">
                  Customer Name
                </TableCell>
                <TableCell align="center" width="200em">
                  Rating
                </TableCell>
                <TableCell align="center" width="200em">
                  Review
                </TableCell>
                <TableCell align="center" width="200em">
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewData.map((review, index) => (
                <TableRow key={review.id}>
                  <TableCell align="center">
                    {review.attributes.customerName}
                  </TableCell>
                  <TableCell align="center">
                    <Rating value={review.attributes.rating} readOnly></Rating>
                  </TableCell>
                  <TableCell align="center">
                    {review.attributes.reviewContent}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(review.attributes.createdAt)}
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
