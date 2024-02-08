import { Button, Card, CardContent, Typography } from '@material-ui/core';

const CartItem = ({ item, addToItemQuantity, removeFromItemQuantity }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{item.name}</Typography>
        <Typography variant="body1">Quantity: {item.quantity}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => addToItemQuantity(item.itemID)}
        >
          +
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeFromItemQuantity(item.itemID)}
        >
          -
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartItem;
