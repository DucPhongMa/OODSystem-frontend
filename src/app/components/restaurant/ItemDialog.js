import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  CardMedia,
  Button,
  useMediaQuery,
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
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  const [cart, setCart] = useAtom(cartAtom);

  const handleAddToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.itemID === item.id
      );
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem.itemID === item.id
            ? { ...cartItem, quantity: cartItem.quantity + itemCount }
            : cartItem
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            itemID: item.id,
            name: item.name,
            price: item.price,
            quantity: itemCount,
            counter: item.counter,
            discount: item.discount,
          },
        ];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
    handleCloseDialog();
  };

  if (isMobileOrTablet) {
    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen
        className={`${theme} ${styles.itemDialog}`}
        PaperProps={{
          style: {
            width: "100vw",
            maxWidth: "100vw",
            margin: 0,
            padding: 0,
          },
        }}
      >
        <Box sx={{ width: "100%", p: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <IconButton
              onClick={handleCloseDialog}
              className={`${theme} ${styles.dialogClose}`}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "35vh",
                objectFit: "contain",
              }}
              image={item?.imageURL}
              alt={item?.name}
            />

            <Typography
              variant="h5"
              sx={{ mt: 2, textAlign: "center" }}
              className={`${theme} ${styles.dialogItemName}`}
            >
              {item?.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 1, textAlign: "center" }}
              className={`${theme} ${styles.dialogItemDescription}`}
            >
              {item?.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
                mb: 2,
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
              fullWidth
              variant="contained"
              onClick={handleAddToCart}
              disabled={!isOpen}
              className={`${theme} ${styles.dialogButton}`}
              sx={{ mt: 2 }}
            >
              {isOpen
                ? `Add to Cart $${(item?.price * itemCount).toFixed(2)}`
                : `Restaurant is Closed $${(item?.price * itemCount).toFixed(2)}`}
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // Desktop version
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      className={`${theme} ${styles.itemDialog}`}
    >
      <DialogTitle>
        <IconButton
          onClick={handleCloseDialog}
          className={`${theme} ${styles.dialogClose}`}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
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
              width: "100%",
              height: "auto",
              maxHeight: "50vh",
              objectFit: "contain",
            }}
            image={item?.imageURL}
            alt={item?.name}
          />

          <Typography
            variant="h4"
            sx={{ mt: 2 }}
            className={`${theme} ${styles.dialogItemName}`}
          >
            {item?.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 1 }}
            className={`${theme} ${styles.dialogItemDescription}`}
          >
            {item?.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
              mb: 2,
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
            onClick={handleAddToCart}
            disabled={!isOpen}
            className={`${theme} ${styles.dialogButton}`}
            sx={{ minWidth: 200 }}
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
