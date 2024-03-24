import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  CardMedia,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../store";
import styles from "../../styles/RestaurantMenu.module.scss";

export default function ItemDialog({
  item,
  handleItemCountChange,
  itemCount,
  openDialog,
  handleCloseDialog,
  theme,
  isOpen,
}) {
  const [cart, setCart] = useAtom(cartAtom);
  const handleAddToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.itemID === item.id
      );
      let updatedCart;

      if (existingItem) {
        // If item already exists in the cart, increase its quantity
        updatedCart = prevCart.map((cartItem) =>
          cartItem.itemID === item.id
            ? { ...cartItem, quantity: cartItem.quantity + itemCount }
            : cartItem
        );
      } else {
        // If item doesn't exist in the cart, add it
        updatedCart = [
          ...prevCart,
          {
            itemID: item.id,
            name: item.name,
            price: item.price,
            quantity: itemCount,
            counter: item.counter,
          },
        ];
      }
      if (typeof window !== "undefined") {
        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      return updatedCart;
    });

    handleCloseDialog();
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      className={`${theme} ${styles.itemDialog}`}
      sx={{ marginTop: "-50px" }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
          className={`${theme} ${styles.dialogClose}`}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <CardMedia
            component="img"
            sx={{
              width: "auto",
              height: "auto",
              maxWidth: 500,
              maxHeight: 500,
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "contain",
              margin: "auto",
            }}
            image={item?.imageURL}
            alt={item?.name}
          />
          <Typography
            variant="h4"
            sx={{
              mt: 2,
            }}
            gutterBottom
            className={`${theme} ${styles.dialogItemName}`}
          >
            {item?.name}
          </Typography>
          <Typography
            variant="body1"
            className={`${theme} ${styles.dialogItemDescription}`}
          >
            {item?.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <IconButton
              onClick={() => handleItemCountChange(-1)}
              className={`${theme} ${styles.dialogChangeQuantity}`}
            >
              <RemoveIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="span"
              sx={{ mx: 2 }}
              className={`${theme} ${styles.dialogChangeQuantity}`}
            >
              {itemCount}
            </Typography>
            <IconButton
              onClick={() => handleItemCountChange(1)}
              className={`${theme} ${styles.dialogChangeQuantity}`}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            sx={{mt: 2
            }}
            onClick={handleAddToCart}
            className={`${theme} ${styles.dialogButton}`}
            disabled={!isOpen} // Disable the button if restaurant is closed
          >
            {isOpen
              ? `Add to Cart $${(item?.price * itemCount).toFixed(2)}`
              : `Restaurant is Closed $${(item?.price * itemCount).toFixed(2)}`}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
