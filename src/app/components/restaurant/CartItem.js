import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styles from "../../styles/RestaurantNavbar.module.scss";

const CartItem = ({
  item,
  addToItemQuantity,
  removeFromItemQuantity,
  theme,
}) => {
  return (
    <Card
      sx={{
        my: 2,
        backgroundColor:
          theme === styles.theme2
            ? "#181818"
            : theme === styles.theme3
              ? "#fbfbf7"
              : "#ffffff",
        color:
          theme === styles.theme2
            ? "#E8E8E8"
            : theme === styles.theme3
              ? "#212121"
              : "#212121",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{item.name}</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => removeFromItemQuantity(item.itemID)}
              sx={{
                color:
                  theme === styles.theme2
                    ? "#E8E8E8"
                    : theme === styles.theme3
                      ? "#4d4d4d"
                      : "#757575",
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" component="span" sx={{ mx: 2 }}>
              {item.quantity}
            </Typography>
            <IconButton
              onClick={() => addToItemQuantity(item.itemID)}
              sx={{
                color:
                  theme === styles.theme2
                    ? "#E8E8E8"
                    : theme === styles.theme3
                      ? "#4d4d4d"
                      : "#757575",
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;
