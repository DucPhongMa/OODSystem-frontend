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
  const[cart, setCart]= useAtom(cartAtom);
  const handleAddToCart = () => {
    setCart((prevCart) => [
      ...prevCart,
      {
        itemID: item.id, // Assuming `item` has an `id` property
        name: item.name, // Assuming `item` has a `name` property
        price: item.price, // Assuming `item` has a `price` property
        quantity: itemCount,
      },
    ]);

    handleCloseDialog();
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
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
                width: "100%",
                height: "auto",
                maxWidth: 200,
                margin: "auto",
              }}
              image={item?.imageURL}
              alt={item?.name}
            />
            <Typography variant="h6" gutterBottom>
              {item?.name}
            </Typography>
            <Typography variant="body1">{item?.description}</Typography>
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
              sx={{ mt: 2 }}
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