import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const PickupDetails = ({ cart, subTotal }) => {
  return (
    <Paper sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h6">PICKUP ORDER DETAILS</Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.itemID}>
            <ListItemText
              primary={item.name}
              secondary={`$${(item.price * item.quantity).toFixed(2)}`}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "40%",
                gap: "10%",
              }}
            />
          </ListItem>
        ))}
        <ListItem>
          <ListItemText
            primary="Subtotal"
            secondary={`$${subTotal}`}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "40%",
              gap: "10%",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Tax"
            secondary={`$${(subTotal * 0.13).toFixed(2)}`}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "40%",
              gap: "10%",
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Total"
            secondary={`$${(subTotal * 1.13).toFixed(2)}`}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "40%",
              gap: "10%",
            }}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default PickupDetails;
