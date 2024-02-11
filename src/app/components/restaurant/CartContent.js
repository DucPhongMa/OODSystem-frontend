import { Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { cartAtom } from '../../../../store';

const CartContent = () => {
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

  return (
    <>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        CART
      </Typography>
      <div>
        {cart.map((item) => (
          <CartItem
            key={item.itemID}
            item={item}
            addToItemQuantity={addToItemQuantity}
            removeFromItemQuantity={removeFromItemQuantity}
          />
        ))}
      </div>
    </>
  );
};
export default CartContent;

