import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const ItemLine = ({ name, value }) => {
  return (
    <ListItem>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "40%", textAlign: "right", paddingRight: "10%" }}>
              <Typography>{name}</Typography>
            </Box>
            <Box sx={{ width: "30%" }}>
              <Typography>{value}</Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

const PickupDetails = ({ cart, subTotal }) => {
  return (
    <Paper sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h6">PICKUP ORDER DETAILS</Typography>
      <List>
        {cart.map((item) => (
          <ItemLine
            key={item.name}
            name={item.name}
            value={`$${item.price} * ${item.quantity}`}
          />
        ))}
        <ItemLine name="Subtotal" value={`$${subTotal}`} />
        <ItemLine name="Tax" value={`$${(subTotal * 0.13).toFixed(2)}`} />
        <Divider />
        <ItemLine name="Total" value={`$${(subTotal * 1.13).toFixed(2)}`} />
      </List>
    </Paper>
  );
};

export default PickupDetails;
