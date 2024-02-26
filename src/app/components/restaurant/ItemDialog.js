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

export default function ItemDialog({
  item,
  handleItemCountChange,
  itemCount,
  openDialog,
  handleCloseDialog,
}) {
  const [cart, setCart] = useAtom(cartAtom);
  const handleAddToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.itemID === item.id
      );

      if (existingItem) {
        // If item already exists in the cart, increase its quantity
        return prevCart.map((cartItem) =>
          cartItem.itemID === item.id
            ? { ...cartItem, quantity: cartItem.quantity + itemCount }
            : cartItem
        );
      } else {
        // If item doesn't exist in the cart, add it
        return [
          ...prevCart,
          {
            itemID: item.id,
            name: item.name,
            price: item.price,
            quantity: itemCount,
          },
        ];
      }
    });

    handleCloseDialog();
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
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
              color: (theme) => theme.palette.grey[500],
            }}
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
                fontWeight: "bold",
                color: "#4D4D4D",
                mt: 2,
              }}
              gutterBottom
            >
              {item?.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "grey" }}>
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
              <IconButton onClick={() => handleItemCountChange(-1)}>
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" component="span" sx={{ mx: 2 }}>
                {itemCount}
              </Typography>
              <IconButton onClick={() => handleItemCountChange(1)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: (theme) =>
                  `${theme.palette.primary.main} !important`,
                "&:hover": {
                  backgroundColor: (theme) =>
                    `${theme.palette.primary.dark} !important`,
                },
              }}
              onClick={handleAddToCart}
            >
              Add to Cart ${(item?.price * itemCount).toFixed(2)}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
