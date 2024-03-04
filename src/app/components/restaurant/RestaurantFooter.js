import { Grid, Typography, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";

export default function RestaurantFooter({ restaurantData }) {
  const fullAddress = `${restaurantData.restaurant_contact?.address || ""}, ${restaurantData.restaurant_contact?.city || ""}, ${restaurantData.restaurant_contact?.provinceOrState || ""}, ${restaurantData.restaurant_contact?.postalCode || ""}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <Box
      sx={{
        bgcolor: "#1976d2",
        color: "white",
        padding: "20px 0",
      }}
    >
      <Grid container spacing={0} sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {" "}
        {/* Added paddingLeft here */}
        {/* CONTACT */}
        <Grid item xs={12} sm={4}>
          <Typography
            gutterBottom
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
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
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "10px",
            }}
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
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            SUPPORT
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
          >
            <EmailIcon sx={{ marginRight: "5px" }} />
            <Typography variant="subtitle1">support@restaurant.com</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ textDecoration: "underline" }}>
            https://ood-system-frontend.vercel.app/help
          </Typography>
          <Typography variant="subtitle1" sx={{ textDecoration: "underline" }}>
            https://ood-system-frontend.vercel.app/chat
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
