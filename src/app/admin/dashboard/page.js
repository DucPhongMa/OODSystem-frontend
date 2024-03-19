"use client";
import { useEffect, useState } from "react";
import { checkBusinessLogin } from "@/app/api/auth";
import { Button, Grid, Paper, Box, Typography } from "@mui/material";
import Link from "next/link";
import { LineChart, PieChart } from "@mui/x-charts";
import { getRestaurantByBusinessName } from "../../api/restaurant";
import MainNavbar from "../../components/admin/register/MainNavbar";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurantRoute, setRestaurantRoute] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLoggedIn = checkBusinessLogin();
    console.log(checkLoggedIn);
    setIsLoggedIn(checkLoggedIn);
    setIsLoading(false);

    // Get username from localStorage
    const storedUsername = localStorage.getItem("business-username");
    if (storedUsername) {
      setUsername(storedUsername);

      async function fetchMyAPI() {
        const restaurantData =
          await getRestaurantByBusinessName(storedUsername);
        setRestaurantRoute(restaurantData);
      }

      fetchMyAPI();
    }
  }, []);
  console.log("route: ", restaurantRoute);
  return isLoading ? (
    <div>"Is Loading"</div>
  ) : isLoggedIn ? (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />

      <Box mt={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3} style={{ padding: "20px" }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Pick Up Order System
            </Typography>
            <Typography>Placed Orders: 313</Typography>

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
            <Typography variant="h5" fontWeight="bold" gutterBottom>
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
    </div>
  ) : (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <p>"You are not auth"</p>
    </div>
  );
}
