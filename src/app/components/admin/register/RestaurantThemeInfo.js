import React from "react";
import {
  Grid,
  FormControl,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

function RestaurantThemeInfo({ formData, setFormData }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              id="restaurantThemeID"
              value={formData.restaurantThemeID}
              label="Theme"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  restaurantThemeID: e.target.selectedIndex,
                });
              }}
            >
              <MenuItem value={0}>Classic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantThemeInfo;
