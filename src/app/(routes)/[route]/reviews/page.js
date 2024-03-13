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


export default function OrderHistory() {
  //const [orderHistory, setOrderHistory] = useState(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantRoute = params.route;

  const [restaurantData, setRestaurantData] = useState("");
  const [theme, setTheme] = useState("");


  useEffect(() => {
    setTheme(styles.theme1); // Set page theme

    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      try {
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
    localStorage.setItem("restaurant-route", restaurantRoute);
  }, [restaurantRoute]);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div>
      <RestaurantAppBar restaurantInfo={restaurantData} />
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" style={{ margin: "40px 0" }}>
          Reviews
        </Typography>
       
      </Container>
    </div>
  );
}
