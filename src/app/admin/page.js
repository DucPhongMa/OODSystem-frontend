import { AppBar, Toolbar, Typography, Grid, Button, Box } from "@mui/material";
import Link from "next/link";
import MainNavbar from "../components/admin/register/MainNavbar";
import Image from "next/image";

export default function landing() {
  return (
    <>
      {/* Navbar */}
      <MainNavbar isLoggedin={false} />

      {/* Body */}
      <Box sx={{ padding: "10px", paddingTop: "90px" }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} container justifyContent={"center"}>
            <Box sx={{ textAlign: "center", padding: "0 20px" }}>
              <Typography
                fontSize={"2.5rem"}
                variant="h4"
                sx={{ marginBottom: "50px" }}
              >
                Welcome to Restaurant Website Generator & Food Pick Up
              </Typography>
              <Typography fontSize={"1.5rem"} variant="body1">
                We will help you generate a static website and provide you an
                efficient way to handle pick-up orders.
                <br />
                All we need is your business information.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  href="/admin/login"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976d2",
                    marginRight: "20px",
                    width: "200px",
                    height: "65px",
                  }}
                >
                  Login
                </Button>
                <Button
                  href="/admin/register"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976d2",
                    width: "200px",
                    height: "65px",
                  }}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent={"center"}>
            {/* Responsive Image */}
            <Box sx={{ maxWidth: "650px", width: "100%", height: "auto" }}>
              <Image
                src="https://picsum.photos/650/600"
                alt="placeholder image"
                layout="responsive"
                width={650}
                height={600}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
