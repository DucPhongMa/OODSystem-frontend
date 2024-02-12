import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

export default function ItemCard({ item, handleOpenDialog }) {
  return (
    <Card sx={{ display: "flex", mb: 2, height: 140 }}>
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onClick={() => handleOpenDialog(item)}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
          >
            {item.description}
          </Typography>
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
          >
            ${item.price}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{
            width: 151,
            objectFit: "contain",
            alignSelf: "center",
          }}
          image={item.imageURL}
          alt={item.name}
        />
      </CardActionArea>
    </Card>
  );
}