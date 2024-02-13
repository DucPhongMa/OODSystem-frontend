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
} from "@mui/material"
import { useForm } from "react-hook-form"
import { loginUser } from "@/app/api/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CustomerLoginPage() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()

  const handleFormSubmit = async (formData) => {
    const currentRestaurant = localStorage.getItem("restaurant-route")
    const error = await loginUser(formData.email, formData.password)
    if (error) {
      console.log(error)
      setError(error)
    } else {
      router.push(currentRestaurant)
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
            <Link href="/DannySushi/login">Log In</Link>{" "}
            {/* I don't know how to get dynamic route */}
          </Typography>
          <Typography>
            <Link href="/DannySushi/register">Register</Link>{" "}
            {/* I don't know how to get dynamic route */}
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
          <Typography variant="h3">Log In</Typography>

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
                xs={12}
              >
                <TextField
                  autoComplete="email"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  {...register("email")}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  autoComplete="password"
                  required
                  id="password"
                  label="Password"
                  type="password"
                  {...register("password")}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={6}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: "#1976d2",
                    width: "180px",
                    height: "35px",
                    marginTop: "2em",
                  }}
                >
                  Log In
                </Button>
              </Grid>

              <Grid
                item
                xs={6}
              >
                {/* I don't know how to get dynamic route */}
                <Button
                  href="/DannySushi/register"
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: "#1976d2",
                    width: "180px",
                    height: "35px",
                    marginTop: "2em",
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}
