import { Box, Button, IconButton, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../store";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "./CartItem";
import { useRouter, useParams } from "next/navigation";
import styles from "../../styles/RestaurantNavbar.module.scss";
import { getRestaurantByRoute } from "../../api/restaurant";
import CustomDialog from "./CustomDialog";
import { useEffect, useState } from "react";

const CartContent = ({ handleClose, theme }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const restaurantRoute = params.route;
  const [cart, setCart] = useAtom(cartAtom);

  const handleDialogClose = () => {
    setDialogOpen(false);
    window.location.reload();
  };

  const addToItemQuantity = (itemID) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.itemID === itemID ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const removeFromItemQuantity = (itemID) => {
    setCart((prevCart) => {
      return prevCart.reduce((acc, item) => {
        if (item.itemID === itemID) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    });
  };

  const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    setCart([]);
  };

  const handleCheckout = async () => {
    const data = await getRestaurantByRoute(restaurantRoute);
    console.log(data);

    // Get open/closed status
    const status = data.attributes.status;

    if (status === "open") {
      // Proceed to checkout if restaurant is open
      console.log(cart);
      router.push(`/${restaurantRoute}/checkout`, { scroll: false });
    } else {
      // Show an error dialog if restaurant is closed
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CART
        </Typography>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color:
              theme === styles.theme2
                ? "#ffffff"
                : theme === styles.theme3
                  ? "#4d4d4d"
                  : "#757575",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {cart.length === 0 && (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          It's empty now!
        </Typography>
      )}

      {cart.length > 0 && (
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "auto",
            pr: 2,
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "inherit",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          {cart.map((item) => (
            <CartItem
              key={item.itemID}
              item={item}
              addToItemQuantity={addToItemQuantity}
              removeFromItemQuantity={removeFromItemQuantity}
              theme={theme}
            />
          ))}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              onClick={clearCart}
              sx={{
                border: "none",
                backgroundColor:
                  theme === styles.theme2
                    ? "#181818"
                    : theme === styles.theme3
                      ? "#42613d"
                      : "#1976d2",
                color: "#ffffff",
                fontWeight: "normal",
                "&:hover": {
                  border: "none",
                  backgroundColor:
                    theme === styles.theme2
                      ? "#666666"
                      : theme === styles.theme3
                        ? "#385234"
                        : "#1565c0",
                },
              }}
            >
              Clear Cart
            </Button>

            <Button
              variant="outlined"
              onClick={handleCheckout}
              sx={{
                border: "none",
                backgroundColor:
                  theme === styles.theme2
                    ? "#181818"
                    : theme === styles.theme3
                      ? "#42613d"
                      : "#1976d2",
                color: "#E8E8E8",
                fontWeight: "normal",
                "&:hover": {
                  border: "none",
                  backgroundColor:
                    theme === styles.theme2
                      ? "#666666"
                      : theme === styles.theme3
                        ? "#385234"
                        : "#1565c0",
                },
              }}
            >
              Check Out
            </Button>
          </Box>
        </Box>
      )}
      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        text="The restaurant is now closed. Please try again later."
        title="Restaurant Closed"
      />
    </>
  );
};

export default CartContent;
