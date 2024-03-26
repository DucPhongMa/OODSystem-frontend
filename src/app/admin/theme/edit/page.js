"use client";
import { checkBusinessLogin } from "@/app/api/auth";
import {
  getRestaurantByBusinessName,
  getRestaurantByRoute,
  updateThemeID,
} from "@/app/api/restaurant";
import { useEffect, useState } from "react";
import MainNavbar from "../../../components/admin/register/MainNavbar";
import {
  Button,
  Box,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function EditThemePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [storedUsername, setStoredUsername] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantRoute, setRestaurantRoute] = useState("");

  const handleThemeChange = (event) => {
    setSelectedTheme(parseInt(event.target.value, 10));
  };

  const saveTheme = async () => {
    let themeName = "";

    switch (selectedTheme) {
      case 1:
        themeName = "Classic";
        break;
      case 2:
        themeName = "Dark";
        break;
      case 3:
        themeName = "Modern";
        break;
      default:
        themeName = "Unknown";
    }
    const newThemeObj = { id: selectedTheme, name: themeName };
    console.log(newThemeObj);
    console.log("storedUsername");
    console.log(storedUsername);
    try {
      await updateThemeID(storedUsername, newThemeObj);
      console.log("Change theme successfully");
      alert("Theme changed successfully");
    } catch (error) {
      console.error("Change theme failed: ", error);
      setIsLoading(false);
      alert("Failed to update theme. Please try again.");
      return;
    }
  };

  useEffect(() => {
    const checkLoggedIn = checkBusinessLogin();
    setIsLoggedIn(checkLoggedIn);
    console.log("is logged in: " + checkLoggedIn);

    // Get username from localStorage
    const storedUsername = localStorage.getItem("business-username");
    if (storedUsername) {
      setStoredUsername(storedUsername);

      async function fetchMyAPI() {
        await getRestaurantByBusinessName(storedUsername).then((route) => {
          setRestaurantRoute(route);
          console.log("route: " + route);
        });
      }
      fetchMyAPI();
    }
  }, [restaurantRoute]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const data = await getRestaurantByRoute(restaurantRoute);
      setRestaurantData(data);
      console.log(data);
      console.log("theme: " + data.attributes.theme.name);

      setSelectedTheme(data.attributes.theme.id);
    };

    if (restaurantRoute) {
      fetchData();
    }
    // setIsLoading(false);
  }, [restaurantRoute]);

  useEffect(() => {
    if (selectedTheme == 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [selectedTheme]);

  return isLoading ? (
    "Page is loading"
  ) : isLoggedIn ? (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <Box
        sx={{
          mt: 3,
          maxHeight: "100vh",
          overflow: "auto",
          flexDirection: "column",
          paddingX: "5%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="theme"
                name="theme"
                value={selectedTheme}
                onChange={handleThemeChange}
                row
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Classic"
                />
                <FormControlLabel value={2} control={<Radio />} label="Dark" />
                <FormControlLabel
                  value={3}
                  control={<Radio />}
                  label="Modern"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={saveTheme}>Save Change</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  ) : (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <p>Please log in</p>
    </div>
  );
}
