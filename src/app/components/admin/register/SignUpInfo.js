import React from "react";
import { TextField, Grid, Box, useMediaQuery } from "@mui/material";

function SignUpInfo({ formData, setFormData }) {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  return (
    <Box sx={{ mt: 3, width: "100%", px: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="email"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value.trim() })
            }
            inputProps={{
              maxLength: 320,
            }}
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
            value={formData.password}
            onChange={(event) =>
              setFormData({ ...formData, password: event.target.value })
            }
            inputProps={{
              maxLength: 128,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            autoComplete="confirm-password"
            required
            fullWidth
            id="confirm-password"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) =>
              setFormData({ ...formData, confirmPassword: event.target.value })
            }
            inputProps={{
              maxLength: 128,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpInfo;
