import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartItem = ({ item, addToItemQuantity, removeFromItemQuantity }) => {
  return (
    <Card sx={{ my: 2 }}>
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
            <IconButton onClick={() => removeFromItemQuantity(item.itemID)}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" component="span" sx={{ mx: 2 }}>
              {item.quantity}
            </Typography>
            <IconButton onClick={() => addToItemQuantity(item.itemID)}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;
