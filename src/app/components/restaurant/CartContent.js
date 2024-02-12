import { Box, Button, IconButton, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { cartAtom } from '../../../../store';
import CloseIcon from '@mui/icons-material/Close';
import CartItem from './CartItem';
import { useRouter } from 'next/navigation';

const CartContent = ({ handleClose }) => {
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  console.log('cart:');
  console.log(cart);

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

  const clearCart=()=>{
    setCart([]);
  }

  const handleCheckout=()=>{
    // link to checkout
    console.log(cart)
    router.push('/[route]/checkout');
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CART
        </Typography>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {cart.length === 0 && (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          It's empty now!
        </Typography>
      )}
      {cart.length > 0 && (
        <div>
          {cart.map((item) => (
            <CartItem
              key={item.itemID}
              item={item}
              addToItemQuantity={addToItemQuantity}
              removeFromItemQuantity={removeFromItemQuantity}
            />
          ))}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button variant="outlined" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button variant="outlined" onClick={handleCheckout}>
              Check Out
            </Button>
          </Box>
        </div>
      )}
    </>
  );
};
export default CartContent;
