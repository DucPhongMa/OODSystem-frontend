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
  const handleChangeTheme = (event) => {
    const themeId = event.target.value;
    let themeName = "";

    switch (themeId) {
      case 1:
        themeName = "Classic";
        break;
      case 2:
        themeName = "Dark";
        break;
      case 3:
        themeName = "Modern";
        break;
      default:
        themeName = "Unknown";
    }

    setFormData({
      ...formData,
      restaurantTheme: {
        id: themeId,
        name: themeName,
      },
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              id="restaurantThemeID"
              value={formData.restaurantTheme.id}
              label="Theme"
              onChange={handleChangeTheme}
            >
              <MenuItem value={1}>Classic</MenuItem>
              <MenuItem value={2}>Dark</MenuItem>
              <MenuItem value={3}>Modern</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantThemeInfo;
