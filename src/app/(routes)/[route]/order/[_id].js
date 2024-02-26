"use client";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../../store";
import { useState, useEffect } from "react";
import { checkCustomerLogin } from "@/app/api/auth";
import {
  TextField,
  Box,
  Paper,
  Typography,
  TextareaAutosize,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";

import { addOrder } from "@/app/api/order";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import { useParams } from "next/navigation";
import { getRestaurantByRoute } from "@/app/api/restaurant";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PickupLocation from "@/app/components/restaurant/PickupLocation";
import PickupDetails from "@/app/components/restaurant/PickupDetails";

export default function Order() {
  const router = useRouter();
  console.log(router.query); // Check the query parameters
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const params = useParams();
  const restaurantRoute = params.route;
  const [formData, setFormData] = useState({
    phoneNum: "",
    customerName: "",
    additionalNotes: "",
  });
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const customerInfo = checkCustomerLogin();
    if (customerInfo) {
      setFormData({ ...formData, phoneNum: JSON.parse(customerInfo).phoneNum });
    }
  }, [formData]);

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      setRestaurantId(restaurantData.id);
      const menuItems =
        restaurantData.attributes.menu.data.attributes.menu_items.data.map(
          (item) => {
            return {
              name: item.attributes.name,
              price: item.attributes.price,
              imageURL: item.attributes.imageURL,
              categoryID: item.attributes.menu_category.data.id,
              id: item.id,
              description: item.attributes.description,
            };
          }
        );
      const menuCate =
        restaurantData.attributes.menu.data.attributes.menu_categories.data.map(
          (cat) => {
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items: menuItems.filter((item) => item.categoryID == cat.id),
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
  }, [restaurantRoute]);

  return (
    <>
      {!restaurantData && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantData == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {restaurantData && (
        <>
          <RestaurantAppBar restaurantInfo={restaurantData} />
          <Box sx={{ padding: 2 }}>
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
              <Typography variant="h6">PICKUP INFO</Typography>
            </Paper>

            {/* Address map */}
            <PickupLocation
              address={restaurantData.restaurant_contact.address}
            />

            {/* pickup details */}
            <PickupDetails cart={cart} subTotal={subTotal} />

            <Typography variant="h6">
              Pay in Person ${(subTotal * 1.13).toFixed(2)}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
}
