"use client";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import Image from "next/image";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import { useEffect, useState } from "react";
import styles from "../../../styles/RestaurantHomepage.module.scss";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
export default function AboutPage() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const restaurantRoute = JSON.parse(
      localStorage.getItem("restaurant-data")
    ).route;

    const themeID = JSON.parse(localStorage.getItem("restaurant-data")).themeID;

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
      console.log(
        restaurantData.attributes.restaurant_description.aboutDescription
      );
    }

    fetchMyAPI();
  }, []);
  return (
    <>
      {restaurantData ? (
        <>
          <RestaurantAppBar data={restaurantData} />

          <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            {/* Image and Intro Section */}
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
                <Typography variant="h5" gutterBottom>
                  About Us
                </Typography>
                <Typography variant="body1" paragraph>
                  {restaurantData.restaurant_description.aboutDescription}
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <RestaurantFooter restaurantData={restaurantData} />
        </>
      ) : (
        "Is loading"
      )}
    </>
  );
}
