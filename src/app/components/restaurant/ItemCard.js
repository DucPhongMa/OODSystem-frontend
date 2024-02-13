import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

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
        <CardContent sx={{ flex: "1 0 auto", width: 'calc(100% - 151px)' }}>
          <Typography component="div" variant="h6">
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {item.description}
          </Typography>
          <Typography
            variant="body1"
            color="text.primary"
            component="div"
            sx={{ marginTop: 1 }}
          >
            ${parseFloat(item.price).toFixed(2)}
          </Typography>
        </CardContent>
        <Box sx={{
          width: 151,
          height: 151,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CardMedia
            component="img"
            sx={{
              height: '100%',
              objectFit: "cover",
            }}
            image={item.imageURL}
            alt={item.name}
          />
        </Box>
      </CardActionArea>
    </Card>
  );
}
