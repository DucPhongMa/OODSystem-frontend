import { Grid, Typography } from "@mui/material";

export default function RestaurantFooter({ restaurantData }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: "20px",
        bgcolor: "#0066ff",
        height: "300",
        maxWidth: "100%",
      }}
    >
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          CONTACT <br />
        </Typography>
        <Typography
          gutterBottom
          variant="h7"
          component="div"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          Phone: {restaurantData.restaurant_contact.phone}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          LOCATION <br />
        </Typography>
        <Typography
          gutterBottom
          variant="h7"
          component="div"
          sx={{
            textAlign: "left",
            color: "white",
          }}
        >
          Address: {restaurantData.restaurant_contact.address} <br />
          City:{restaurantData.restaurant_contact.city} <br />
          Postal Code: {restaurantData.restaurant_contact.postalCode} <br />
          Province:{restaurantData.restaurant_contact.provinceOrState}
        </Typography>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          SUPPORT <br />
        </Typography>
        <Typography
          gutterBottom
          variant="h7"
          component="div"
          sx={{
            textAlign: "center",
            color: "white",
          }}
        ></Typography>
      </Grid>
    </Grid>
  );
}
