"use client"
import {
  TextField,
  Button,
  Grid,
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Checkbox,
} from "@mui/material"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { registerCustomer } from "@/app/api/auth"
import { useRouter } from "next/navigation"

export default function CustomerRegisterPage() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()

  const handleFormSubmit = async (formData) => {
    const fullName = formData.firstName + " " + formData.lastName
    const currentRestaurant = localStorage.getItem("restaurant-route")
    const error = await registerCustomer(
      formData.email,
      formData.password,
      fullName,
      formData.phoneNum
    )
    if (error) {
      setError(error)
    } else {
      currentRestaurant && router.push(`/${currentRestaurant}`)
    }
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography style={{ marginRight: "40px" }}>
            <Link href="/about">About</Link>
          </Typography>
          <Typography>
            <Link href="/contact">Contact</Link>
          </Typography>

          <div style={{ flexGrow: 1 }}></div>

          <Typography style={{ marginRight: "40px" }}>
            <Link href="/customer/login">Log In</Link>{" "}
          </Typography>
          <Typography>
            <Link href="/customer/register">Register</Link>{" "}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Register</Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            sx={{ mt: 5 }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={6}
              >
                <TextField
                  required
                  fullWidth
                  id="fName"
                  label="First Name"
                  {...register("firstName")}
                />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <TextField
                  required
                  fullWidth
                  id="lName"
                  label="Last Name"
                  {...register("lastName")}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  autoComplete="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  {...register("email")}
                />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <TextField
                  autoComplete="password"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  {...register("password")}
                />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <TextField
                  required
                  fullWidth
                  id="confirm"
                  label="Confirm Password"
                  type="password"
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  {...register("phoneNum")}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Typography variant="body1">
                  Do you agree to the{" "}
                  <Link href="">
                    <u>Terms and Conditions</u>
                  </Link>
                  <Checkbox required></Checkbox>
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                backgroundColor: "#1976d2",
                height: "35px",
                marginTop: "2em",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Register
            </Button>
            <Typography variant="caption">
              Existing User? <Link href="/DannySushi/login">Sign in</Link>.
            </Typography>{" "}
            {/* I don't know how to get dynamic route */}
          </Box>
        </Box>
      </Container>
    </>
  )
}
