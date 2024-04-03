import { Grid, Typography, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import styles from "../../styles/RestaurantFooter.module.scss";
import { useEffect, useState } from "react";

export default function RestaurantFooter({ restaurantData }) {
  const themeID = restaurantData.theme?.id || 1;
  const [theme, setTheme] = useState("");
  const fullAddress = `${restaurantData.restaurant_contact?.address || ""}, ${restaurantData.restaurant_contact?.city || ""}, ${restaurantData.restaurant_contact?.provinceOrState || ""}, ${restaurantData.restaurant_contact?.postalCode || ""}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  useEffect(() => {
    switch (themeID) {
      case 1:
        setTheme(styles.theme1);
        break;
      case 2:
        setTheme(styles.theme2);
        break;
      case 3:
        setTheme(styles.theme3);
        break;
      default:
        setTheme(styles.theme1);
    }
  }, [themeID]);

  return (
    <Box className={theme}>
      <Grid container spacing={0} sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {" "}
        {/* CONTACT */}
        <Grid item xs={12} sm={4}>
          <Typography
            gutterBottom
            className={`${theme} ${styles.sectionTitle}`}
          >
            CONTACT
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
          >
            <PhoneIcon sx={{ marginRight: "5px" }} />
            <Typography variant="subtitle1">
              {restaurantData.restaurant_contact?.phone || "N/A"}
            </Typography>
          </Box>
        </Grid>
        {/* LOCATION */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            padding: "0 80px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            gutterBottom
            className={`${theme} ${styles.sectionTitle}`}
          >
            LOCATION
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
              cursor: "pointer",
            }}
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            <PlaceIcon sx={{ marginRight: "5px" }} />
            <Typography variant="subtitle1">
              {restaurantData.restaurant_contact?.address || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "left" }}>
            {" "}
            {/* Removed paddingLeft adjustment */}
            <Typography variant="subtitle1">
              {restaurantData.restaurant_contact?.city || "N/A"},{" "}
              {restaurantData.restaurant_contact?.provinceOrState || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              {restaurantData.restaurant_contact?.postalCode || "N/A"}
            </Typography>
          </Box>
        </Grid>
        {/* SUPPORT */}
        <Grid item xs={12} sm={4} sx={{ padding: "0 200px" }}>
          <Typography
            gutterBottom
            className={`${theme} ${styles.sectionTitle}`}
          >
            SUPPORT
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
              whiteSpace: "nowrap",
            }}
          >
            <EmailIcon sx={{ marginRight: "5px" }} />
            <Typography variant="subtitle1">
              <a href="http://ood-system-frontend.vercel.app/contact">
                IT Support
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
