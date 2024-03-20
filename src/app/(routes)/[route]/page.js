"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { Typography, Box, Container, Grid, Backdrop } from "@mui/material";
import { getRestaurantByRoute } from "../../api/restaurant";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import Link from "next/link";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import styles from "../../styles/RestaurantHomepage.module.scss";
import { useAtom } from "jotai";
import { getAllReviews } from "../../api/review";

export default function RestaurantHomepage() {
  const [restaurantData, setRestaurantData] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const [topPickItems, setTopPickItems] = useState([]);
  const params = useParams();

  const restaurantRoute = params.route;

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      console.log(restaurantData);

      const themeID = restaurantData.attributes.theme.id;

      // For testing only
      // const themeID = 3;
      // restaurantData.attributes.theme.id = 3;

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
          setTheme(styles.theme1); // Default theme
      }

      // Set top-pick items
      if (restaurantData["top-pick"]) {
        setTopPickItems(restaurantData["top-pick"]);
      }

      try {
        const ReviewData = await getAllReviews(restaurantRoute);
        setReviewData(ReviewData);
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
              theme: item.attributes.theme,
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
              image:
                items.length > 0
                  ? items[0].imageURL
                  : "/category_placeholder.jpeg", // Use either first item's image or placeholder
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
  }, [restaurantRoute]);

  const reviewList = reviewData
    ? reviewData.map((review) => ({
        reviewCusName: review.attributes.customerName,
        reviewRating: review.attributes.rating,
        reviewContent: review.attributes.reviewContent,
      }))
    : [];

  /*const completedOrders = orderHistoryList.filter(
    (order) => order.orderStatus === "completed"
  );*/

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("All Reviews: ", reviewData);

  return (
    <div className={theme}>
      <Box className={`${theme} ${styles.pageBackground}`}>
        {!restaurantData && (
          <Backdrop
            className={`${theme} ${styles.backdrop}`}
            open={!restaurantData}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {restaurantData && (
          <>
            <RestaurantAppBar restaurantInfo={restaurantData} />
            <Box
              className={`${theme} ${styles.bannerBox}`}
              style={{ backgroundImage: `url(${restaurantData.bannerURL})` }}
            >
              <Typography
                variant="h1"
                component="h1"
                className={`${theme} ${styles.styledTypography}`}
              >
                {restaurantData.name.split(" ").map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </Typography>
            </Box>
            {/* CATEGORIES */}
            <Box className={`${theme} ${styles.categoryBoxContainer}`}>
              <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="space-between">
                  {restaurantData.menuCate.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={index}
                      className={`${theme} ${styles.categoryBox}`}
                    >
                      <Link
                        href={`/${restaurantRoute}/menu#${
                          index === 0 ? "top" : item.name.replace(/\s/g, "_")
                        }`}
                        passHref
                      >
                        <Box className={`${theme} ${styles.innerCategoryBox}`}>
                          <Box
                            className={`${theme} ${styles.categoryImageBox}`}
                          >
                            <Image
                              src={item.image || "/category_placeholder.jpeg"}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </Box>
                        </Box>
                      </Link>
                      <Typography
                        variant="h5"
                        component="h3"
                        className={`${theme} ${styles.categoryName}`}
                      >
                        {item.name.toUpperCase()}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
            {/* TOP PICKS */}
            {topPickItems.length > 0 && (
              <Box
                className={`${theme} ${styles.topPicksSection}`}
                style={{ backgroundImage: `url(${restaurantData.bannerURL})` }}
              >
                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  className={`${theme} ${styles.topPicksTitle}`}
                >
                  TOP PICKS
                </Typography>
                <Container
                  maxWidth="lg"
                  className={`${theme} ${styles.topPicksContainer}`}
                >
                  <Grid container spacing={2}>
                    {topPickItems.map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        key={index}
                        className={`${theme} ${styles.topPickItem}`}
                      >
                        <Link
                          href={`/${restaurantData.route}/menu#${item.attributes.menu_category.data.attributes.nameCate.replace(/\s+/g, "_")}`}
                        >
                          <Box className={`${theme} ${styles.topPickItemBox}`}>
                            <Box
                              className={`${theme} ${styles.categoryImageBox}`}
                            >
                              <Image
                                src={item.attributes.imageURL}
                                alt={item.attributes.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </Box>
                          </Box>
                          <Typography
                            variant="h5"
                            component="h3"
                            className={`${theme} ${styles.topPickItemTitle}`}
                          >
                            {item.attributes.name.toUpperCase()}
                          </Typography>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            )}
            {/* REVIEWS */}
            <Box className={`${theme} ${styles.reviewsSection}`}>
              <Typography
                variant="h3"
                component="h3"
                className={`${styles.reviewsTitle}`}
              >
                REVIEWS
              </Typography>
              <Container
                maxWidth="lg"
                className={`${theme} ${styles.reviewsContainer}`}
              >
                <Grid container spacing={2}>
                  {reviewList.slice(0, 3).map((review, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={index}
                      className={`${theme} ${styles.reviewItem}`}
                    >
                      <Link href={`/${restaurantRoute}/reviews`}>
                        <Box className={`${theme} ${styles.reviewBox}`}>
                          <Typography
                            variant="subtitle1"
                            component="div"
                            className={`${theme} ${styles.reviewSubtitle}`}
                          >
                            Review {index + 1}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="div"
                            className={`${theme} ${styles.reviewText}`}
                          >
                            <div>{review.reviewCusName}</div>
                            <div>Rating: {review.reviewRating}</div>
                            <div>{review.reviewContent}</div>
                          </Typography>
                        </Box>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
            <RestaurantFooter restaurantData={restaurantData} />
          </>
        )}
      </Box>
    </div>
  );
}
