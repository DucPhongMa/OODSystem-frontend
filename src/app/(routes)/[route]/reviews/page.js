"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Rating,
  Box,
  Paper,
  TablePagination,
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import styles from "../../../styles/RestaurantReviews.module.scss";
import { getAllReviews } from "../../../api/review";

export default function OrderHistory() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantRoute = params.route;
  const [restaurantData, setRestaurantData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [theme, setTheme] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default number of rows per page

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    <Box
      className={`${theme} pageBackground`}
      sx={{ minHeight: "100vh" }}
    >
      <RestaurantAppBar data={restaurantData} />

      <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            mt: 0,
            mb: 4,
            fontWeight: "bold",
            color: "#333",
            fontSize: "2rem",
            "&::after": {
              content: '""',
              display: "block",
              width: "120px",
              height: "3px",
              backgroundColor: "#baa378",
              borderRadius: "1px",
              margin: "8px auto 0",
            },
          }}
        >
          REVIEWS
        </Typography>
        {reviewData.length > 0 ? (
          reviewData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((review) => (
              <Paper
                key={review.id}
                sx={{ mb: 2, p: 2, backgroundColor: "#ffffff" }}
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {review.attributes.customerName || "Guest"}
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      display: "block",
                      color: "text.secondary",
                      fontSize: "0.875rem",
                    }}
                  >
                    Reviewed on{" "}
                    {new Date(review.attributes.createdAt).toLocaleDateString()}
                  </Typography>
                </Typography>
                <Rating
                  value={review.attributes.rating}
                  readOnly
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2">
                  {review.attributes.reviewContent}
                </Typography>
              </Paper>
            ))
        ) : (
          <Typography align="center">No reviews yet.</Typography>
        )}
      </Container>
      <TablePagination
        component="div"
        count={reviewData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 15]}
      />
      <RestaurantFooter restaurantData={restaurantData} />
    </Box>
  );
}
