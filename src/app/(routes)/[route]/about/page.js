"use client";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import Image from "next/image";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import { useEffect, useState, useCallback } from "react";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import styles from "../../../styles/RestaurantAbout.module.scss";
import { useParams } from "next/navigation";

export default function AboutPage() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [theme, setTheme] = useState("");
  const params = useParams();
  const restaurantRoute = params.route;

  const fetchRestaurantData = useCallback(async () => {
    const data = await getRestaurantByRoute(restaurantRoute);
    console.log(data);

    const themeID = data.attributes.theme.id;

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

    const menuItems = data.attributes.menu.data.attributes.menu_items.data.map(
      (item) => {
        return {
          name: item.attributes.name,
          price: item.attributes.price,
          imageURL: item.attributes.imageURL,
          categoryID: item.attributes.menu_category.data?.id,
          id: item.id,
          description: item.attributes.description,
          discount: item.attributes.discount,
          counter: item.attributes.counter,
          discount: item.attributes.discount,
        };
      }
    );

    const menuCate =
      data.attributes.menu.data.attributes.menu_categories.data.map((cat) => {
        return {
          name: cat.attributes.nameCate,
          id: cat.id,
          items: menuItems.filter((item) => item.categoryID == cat.id),
        };
      });

    setRestaurantData({ ...data.attributes, menuCate });
  }, [restaurantRoute]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  return (
    <div className={theme}>
      {restaurantData ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
          className={`${theme} ${styles.pageBackground}`}
        >
          <Box sx={{ flexGrow: 1 }}>
            <RestaurantAppBar data={restaurantData} />

            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Image
                    src={restaurantData.logoURL}
                    alt="About Us Image"
                    width={650}
                    height={400}
                    layout="responsive"
                    style={{ borderRadius: "8px" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" marginBottom={3} gutterBottom>
                    About Us
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {restaurantData.restaurant_description.aboutDescription}
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </Box>
          <RestaurantFooter restaurantData={restaurantData} />
        </Box>
      ) : (
        "Is loading"
      )}
    </div>
  );
}
