"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MainNavbar from "../components/admin/register/MainNavbar";

export default function ContactPage() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name.trim()) newErrors.name = "Name is required.";
    if (!formValues.email.trim()) newErrors.email = "Email is required.";
    if (!formValues.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/meqykbra", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          _replyto: formValues.email,
          message: formValues.message,
        }),
      });

      if (response.ok) {
        setOpenSuccessDialog(true);
        setFormValues({ name: "", email: "", message: "" });
      } else {
        console.error("Form submission failed");
        alert("There was an error submitting your form. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      alert("There was a problem with your submission. Please try again.");
    }
  };

  return (
    <>
      <MainNavbar isLoggedin={false} />

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        {/* Contact Information Section */}
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            We're here to help and answer any question you might have.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
              <Typography variant="h5" gutterBottom>
                Our Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Project Manager:</strong> Katie Liu
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> liu_katie@outlook.com
              </Typography>
            </Paper>
          </Grid>

          {/* Contact Form Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
              <Typography variant="h5" gutterBottom>
                Send Us a Message
              </Typography>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  name="name"
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={formValues.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="email"
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="message"
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formValues.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
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
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
      >
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          Thank you for your message. We will get back to you soon.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
