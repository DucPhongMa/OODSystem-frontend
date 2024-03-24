"use client";
import { useEffect, useState } from "react";
import { checkBusinessLogin } from "@/app/api/auth";
import { Button, Grid, Paper, Box, Typography, Switch } from "@mui/material";
import Link from "next/link";
import {
  getRestaurantByBusinessName,
  openRestaurant,
  closeRestaurant,
  getRestaurantByRoute,
} from "../../api/restaurant";
import MainNavbar from "../../components/admin/register/MainNavbar";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurantRoute, setRestaurantRoute] = useState("");
  const [username, setUsername] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const checkLoggedIn = checkBusinessLogin();
    setIsLoggedIn(checkLoggedIn);
    console.log("is logged in: " + checkLoggedIn);

    setIsLoading(false);

    // Get username from localStorage
    const storedUsername = localStorage.getItem("business-username");
    if (storedUsername) {
      setUsername(storedUsername);

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
    const fetchData = async () => {
      const data = await getRestaurantByRoute(restaurantRoute);
      setRestaurantData(data);
      console.log(data);
      console.log("status: " + data.attributes.status);

      if (data.attributes.status === "open") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    if (restaurantRoute) {
      fetchData();
    }
  }, [restaurantRoute]);

  const handleToggleChange = () => {
    const message = isOpen
      ? "Are you sure you want to close the restaurant?"
      : "Are you sure you want to open the restaurant?";
    setDialogMessage(message); // Set the message based on current isOpen state
    setIsDialogOpen(true); // Open dialog for confirmation
  };

  const handleDialogClose = (confirmed) => {
    setIsDialogOpen(false); // Always close the dialog
    if (confirmed) {
      const action = isOpen ? closeRestaurant : openRestaurant;
      action(username).then(() => {
        setIsOpen(!isOpen); // Toggle isOpen state based on action
      });
    }
  };

  return isLoading ? (
    <div>"Is Loading"</div>
  ) : isLoggedIn ? (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />

      <Box mt={4} textAlign="center">
        <Typography variant="h3" fontWeight="bold" color="text.primary">
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3} style={{ padding: "20px" }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "100%" }}>
            <Typography
              variant="h4"
              fontWeight="normal"
              color="text.primary"
              gutterBottom
            >
              Pick Up Order System
            </Typography>
            <br />
            <Typography variant="h6">Placed Orders: 313</Typography>
            <br />
            <br />
            {/* Toggle Switch for Opening or Closing restaurant */}
            <Typography component="div">
              <Grid
                component="label"
                container
                alignItems="center"
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Grid item sx={{ mr: 2, fontSize: "1.25rem" }}>
                  Closed
                </Grid>
                <Grid item>
                  <Switch
                    checked={isOpen}
                    onChange={handleToggleChange}
                    sx={{
                      transform: "scale(1.5)",
                      "& .MuiSwitch-switchBase": {
                        padding: "9px",
                      },
                      "& .MuiSwitch-thumb": {
                        width: "24px",
                        height: "24px",
                      },
                      "& .MuiSwitch-track": {
                        borderRadius: "26px / 50%",
                      },
                    }}
                  />
                </Grid>
                <Grid item sx={{ ml: 2, fontSize: "1.25rem" }}>
                  Open
                </Grid>
              </Grid>
            </Typography>

            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={6}>
                <Link href="/admin/orders#past" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      "&:hover": {
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.dark} !important`,
                      },
                    }}
                    fullWidth
                    onClick={() => (window.location.hash = "past")}
                  >
                    View Past Orders
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link href="/admin/orders" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      "&:hover": {
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.dark} !important`,
                      },
                    }}
                    fullWidth
                  >
                    View Incoming Orders
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "100%" }}>
            <Typography
              variant="h4"
              fontWeight="normal"
              color="text.primary"
              gutterBottom
            >
              Website
            </Typography>

            <br />
            <Link
              href={`https://ood-system-frontend.vercel.app/${restaurantRoute}`}
              passHref
            >
              <Button
                variant="contained"
                style={{ marginTop: "35px" }}
                sx={{
                  mt: 2,
                  backgroundColor: (theme) =>
                    `${theme.palette.secondary.main} !important`,
                  "&:hover": {
                    backgroundColor: (theme) =>
                      `${theme.palette.secondary.dark} !important`,
                  },
                }}
                fullWidth
              >
                View Website
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={isDialogOpen}
        handleClose={() => handleDialogClose(false)}
        handleConfirm={() => handleDialogClose(true)}
        text={dialogMessage}
        title={isOpen ? "Close Restaurant" : "Open Restaurant"}
      />
    </div>
  ) : (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <p>"You are not auth"</p>
    </div>
  );
}
