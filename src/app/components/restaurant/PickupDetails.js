import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import styles from "../../styles/RestaurantCheckout.module.scss";

const ItemLine = ({ name, value }) => {
  return (
    <ListItem sx={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
      <ListItemText
        primary={
          <Box sx={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            width: 450, 
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            <Box sx={{ width: "50%", textAlign: "left", paddingRight: "5%" }}>
              <Typography>{name}</Typography>
            </Box>
            <Box sx={{ width: "50%", textAlign: "right" }}>
              <Typography>{value}</Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

const PickupDetails = ({ cart, subTotal, theme }) => {
  const totalDiscount = cart.reduce((acc, item) => {
    if (item.discount) {
      const discountAmount = item.price * item.discount * 0.01 * item.quantity;
      return acc + discountAmount;
    }
    return acc;
  }, 0);
  const adjustedSubTotal = subTotal - totalDiscount;
  return (
    <Paper sx={{ marginBottom: 2, padding: 2 }} className={`${theme} ${styles.details}`}>
      <Typography variant="h6">PICKUP ORDER DETAILS</Typography>
      <List>
        {cart.map((item) => (
          <ItemLine
            key={item.name}
            name={`${item.quantity} x ${item.name}`}
            value={`$${(item.price * item.quantity).toFixed(2)}`}
          />
        ))}
        <ItemLine name="Subtotal" value={`$${subTotal}`} />
        {totalDiscount > 0 && (
          <ItemLine
            name="Total Discount"
            value={`− $${totalDiscount.toFixed(2)}`}
          />
        )}
        <ItemLine
          name="Tax"
          value={`$${(adjustedSubTotal * 0.13).toFixed(2)}`}
        />
        <Divider />
        <ItemLine
          name="Total"
          value={`$${(adjustedSubTotal * 1.13).toFixed(2)}`}
        />
      </List>
    </Paper>
  );
};

export default PickupDetails;
