import { Grid, Typography, Box, useMediaQuery } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import styles from "../../styles/RestaurantFooter.module.scss";
import { useEffect, useState } from "react";

export default function RestaurantFooter({ restaurantData }) {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
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
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            padding: isMobileOrTablet ? "0 20px" : "0 20px",
            textAlign: "center",
          }}
        >
          <Typography
            gutterBottom
            className={`${theme} ${styles.sectionTitle}`}
          >
            CONTACT
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
              justifyContent: "center",
            }}
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
            padding: isMobileOrTablet ? "0 20px" : "0 20px",
            textAlign: "center",
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
              justifyContent: "center",
            }}
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            <PlaceIcon sx={{ marginRight: "5px" }} />
            <Typography variant="subtitle1">
              {restaurantData.restaurant_contact?.address || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
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
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            padding: isMobileOrTablet ? "0 20px" : "0 20px",
            textAlign: "center",
          }}
        >
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
              marginBottom: "100px",
              whiteSpace: "nowrap",
              justifyContent: "center",
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
