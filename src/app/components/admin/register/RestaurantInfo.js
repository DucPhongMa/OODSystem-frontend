import React,  { useState } from "react";
import { TextField, Grid, Box, Input } from "@mui/material";
import { useAtom } from 'jotai';
import { selectedFileAtom } from '../../../../../store';

function RestaurantInfo({ formData, setFormData  }) {
  //const [file, setFile] = useState(null);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const handleImageUpload =  (e) => {
    //e.preventDefault();
    const uploadedFile = e.target.files[0];
    setSelectedFile(uploadedFile);
   
  };
  return (
    <Box sx={{ mt: 3 }}>
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
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
          />
        </Grid>
        <Grid item xs={12}>
            <label>Upload Image for Banner: </label>
            <Input
              type="file"
              id="upload-image"
              onChange={handleImageUpload}
              inputProps={{
                accept: 'image/*',
              }}
              fullWidth
            />
            <br /><br />
            
        </Grid>
      </Grid>
    </Box>
  );
}

export default RestaurantInfo;
