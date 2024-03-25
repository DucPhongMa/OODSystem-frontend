"use client";
import { checkBusinessLogin } from "@/app/api/auth";
import {
  getRestaurantMenuData,
  updateRestaurantMenu,
  updateThemeID,
} from "@/app/api/restaurant";
import { useEffect, useState } from "react";
import MainNavbar from "../../../components/admin/register/MainNavbar";
import {
  Button,
  Box,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Input,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

export default function EditThemePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantMenuID, setRestaurantMenuID] = useState();
  const [selectedTheme, setSelectedTheme] = useState(1);
  const [storedUsername, setStoredUsername] = useState("");

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
    console.log(storedUsername);
    try {
      await updateThemeID(storedUsername, newThemeObj);
      console.log("Change theme successfully");
    } catch (error) {
      console.error("Change theme failed: ", error);
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    // check user auth
    const checkLoggedIn = checkBusinessLogin();
    setIsLoggedIn(checkLoggedIn);
    // Get username from localStorage
    const storedUsername = localStorage.getItem("business-username");
    setStoredUsername(storedUsername);
    setIsLoading(true);
    if (storedUsername && checkLoggedIn) {
      async function fetchMyAPI() {
        const restaurantMenu = await getRestaurantMenuData(storedUsername);
        console.log(restaurantMenu);
        setRestaurantMenuID(restaurantMenu.data.id);
        setSelectedTheme(
          restaurantMenu.data.attributes.theme
            ? restaurantMenu.data.attributes.theme.id
            : 1
        );
      }
      fetchMyAPI();
    }
    setIsLoading(false);
  }, []);

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
