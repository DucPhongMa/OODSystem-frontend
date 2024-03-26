import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import styles from "../../styles/RestaurantMenu.module.scss";

export default function ItemCard({ item, handleOpenDialog, theme }) {
  const originalPrice = parseFloat(item.price).toFixed(2);
  const discountPercentage = parseFloat(item.discount);
  const discountedPrice = (
    originalPrice -
    originalPrice * (discountPercentage / 100)
  ).toFixed(2);

  return (
    <Card
      sx={{ display: "flex", mb: 2, height: 140 }}
      className={`${theme} ${styles.itemCard}`}
    >
      <CardActionArea
        disableRipple
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onClick={() => handleOpenDialog(item)}
      >
        <CardContent sx={{ flex: "1 0 auto", width: "calc(100% - 151px)" }}>
          <Typography component="div" variant="h6">
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className={`${theme} ${styles.itemDescription}`}
          >
            {item.description}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ marginTop: 1 }}
            className={`${theme} ${styles.itemPrice}`}
          >
            {discountPercentage > 0 ? (
              <>
                <span
                  style={{ textDecoration: "line-through", marginRight: "8px" }}
                >
                  ${originalPrice}
                </span>
                <span className={`${theme} ${styles.discountPrice}`}>
                  {" "}
                  ${discountedPrice}
                </span>
              </>
            ) : (
              `$${originalPrice}`
            )}
          </Typography>
        </CardContent>
        <Box
          sx={{
            width: 151,
            height: 151,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              height: "100%",
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
