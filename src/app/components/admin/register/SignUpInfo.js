import React from "react";
import { TextField, Grid, Box } from "@mui/material";

function SignUpInfo({ formData, setFormData }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="email"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={formData.email}
            onChange={
              (event) =>
                setFormData({ ...formData, email: event.target.value.trim() }) // Trim spaces here
            }
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
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUpInfo;
