"use client";
import {
  TextField,
  Button,
  Grid,
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginUser } from "../../api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MainNavbar from "../../components/admin/register/MainNavbar";

export default function ManagementLoginPage() {
  const [error, setError] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  function validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleFormSubmit = async (formData) => {
    setError(null);

    if (
      !formData.email ||
      !formData.password ||
      formData.email == "" ||
      formData.password == ""
    ) {
      setError("Please fill in email address/password");
    } else if (!validateEmail(formData.email)) {
      setError("Email is not valid");
    } else {
      const error = await loginUser(formData.email, formData.password);
      if (error) {
        console.log(error);
        setError(error);
      } else {
        router.push("/admin/dashboard");
      }
    }
  };

  return (
    <>
      {/* Navbar */}
      <MainNavbar isLoggedin={false} />
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
            {error && <h3 style={{ color: "red" }}>{error}</h3>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
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
          </Box>
        </Box>
      </Container>
    </>
  );
}
