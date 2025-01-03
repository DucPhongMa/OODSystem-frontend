import React, { useState } from "react";
import { TextField, Grid, Box, Input, useMediaQuery } from "@mui/material";
import { useAtom } from "jotai";
import { selectedFileAtom } from "../../../../../store";
import { selectedLogoAtom } from "../../../../../store";

function RestaurantInfo({ formData, setFormData }) {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  //const [file, setFile] = useState(null);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const [, setSelectedLogo] = useAtom(selectedLogoAtom);
  const handleImageUpload = (e) => {
    //e.preventDefault();
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
    }
  };
  const handleLogoUpload = (e) => {
    //e.preventDefault();
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedLogo(uploadedFile);
    }
  };
  return (
    <Box sx={{ mt: 3, width: "100%", px: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="restaurant-name"
            required
            fullWidth
            id="restaurantName"
            label="Restaurant Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            onBlur={(e) =>
              setFormData({ ...formData, name: e.target.value.trim() })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="restaurant-route"
            required
            fullWidth
            id="restaurantRoute"
            label="Restaurant Route"
            value={formData.route}
            onChange={(e) => {
              setFormData({ ...formData, route: e.target.value.trim() });
            }}
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="about-description"
            fullWidth
            id="aboutDescription"
            label="Restaurant Description"
            value={formData.restaurant_description.aboutDescription}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_description: {
                  ...formData.restaurant_description,
                  aboutDescription: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_description: {
                  ...formData.restaurant_description,
                  aboutDescription: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 5000,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="address"
            fullWidth
            id="address"
            label="Address"
            value={formData.restaurant_contact.address}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  address: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  address: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="city"
            fullWidth
            id="city"
            label="City"
            value={formData.restaurant_contact.city}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  city: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  city: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="province-or-state"
            fullWidth
            id="provinceOrState"
            label="Province / State"
            value={formData.restaurant_contact.provinceOrState}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  provinceOrState: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  provinceOrState: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="postal-code"
            fullWidth
            id="postalCode"
            label="Postal Code"
            value={formData.restaurant_contact.postalCode}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  postalCode: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  postalCode: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            autoComplete="phone-number"
            fullWidth
            id="phone"
            label="Phone Number"
            value={formData.restaurant_contact.phone}
            onChange={(e) => {
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  phone: e.target.value,
                },
              });
            }}
            onBlur={(e) =>
              setFormData({
                ...formData,
                restaurant_contact: {
                  ...formData.restaurant_contact,
                  phone: e.target.value.trim(),
                },
              })
            }
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <label>Upload Logo Image: </label>
          <Input
            type="file"
            id="upload-logo"
            onChange={handleLogoUpload}
            inputProps={{
              accept: "image/*",
            }}
            fullWidth
          />
          <br />
          <br />
        </Grid>
        <Grid item xs={12}>
          <label>Upload Image for Banner: </label>
          <Input
            type="file"
            id="upload-image"
            onChange={handleImageUpload}
            inputProps={{
              accept: "image/*",
            }}
            fullWidth
          />
          <br />
          <br />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantInfo;
