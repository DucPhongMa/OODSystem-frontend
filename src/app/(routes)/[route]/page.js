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
import { getRouteAtom } from "../../../../store";

export default function RestaurantHomepage() {
  const [restaurantData, setRestaurantData] = useState("");
  const [theme, setTheme] = useState("");
  const [, setRoute] = useAtom(getRouteAtom);
  const params = useParams();

  const restaurantRoute = params.route;
  setRoute(restaurantRoute);

  useEffect(() => {
    setTheme(styles.theme1); // Set page theme

    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
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
                  {[1, 2, 3].map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={item}
                      className={`${theme} ${styles.topPickItem}`}
                    >
                      <Box className={`${theme} ${styles.topPickItemBox}`}>
                        <Box className={`${theme} ${styles.categoryImageBox}`}>
                          <Image
                            src="/category_placeholder.jpeg"
                            alt={`Top Pick ${item}`}
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
                        ITEM {item}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
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
                  {[1, 2, 3].map((review, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={index}
                      className={`${theme} ${styles.reviewItem}`}
                    >
                      <Box className={`${theme} ${styles.reviewBox}`}>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          className={`${theme} ${styles.reviewSubtitle}`}
                        >
                          Review {review}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          className={`${theme} ${styles.reviewText}`}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Vivamus lacinia odio vitae vestibulum.
                        </Typography>
                      </Box>
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
