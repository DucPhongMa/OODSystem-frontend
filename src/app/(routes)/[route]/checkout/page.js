'use client';
import { useAtom } from 'jotai';
import { cartAtom } from '../../../../../store';
import { useState, useEffect } from 'react';
import { checkCustomerLogin } from '@/app/api/auth';
import {
  TextField,
  Box,
  Paper,
  Typography,
  TextareaAutosize,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { addOrder } from '@/app/api/order';
import RestaurantAppBar from '@/app/components/restaurant/RestaurantAppBar';
import { useParams, useRouter } from 'next/navigation';
import { getRestaurantByRoute } from '@/app/api/restaurant';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PickupLocation from '@/app/components/restaurant/PickupLocation';
import PickupDetails from '@/app/components/restaurant/PickupDetails';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const params = useParams();
  const restaurantRoute = params.route;
  const [formData, setFormData] = useState({
    phoneNum: '',
    customerName: '',
    additionalNotes: '',
  });
  const [subTotal, setSubTotal] = useState(0);
  console.log('cart:');
  console.log(cart);
  useEffect(() => {
    const customerInfo = checkCustomerLogin();
    const customerInfo = checkCustomerLogin();
    if (customerInfo) {
      setFormData({ ...formData, phoneNum: JSON.parse(customerInfo).phoneNum });
      setFormData({ ...formData, phoneNum: JSON.parse(customerInfo).phoneNum });
    }
  }, [formData]);

  // // Sample submit order call to API
  const submitOrder = async () => {
    const orderItems = cart.map((item) => ({
      quantity: item.quantity,
      unit_price: item.price,
      menu_item: item.itemID,
    }));
    const uuid = uuidv4();
    console.log(uuid);
    // await addOrder(
    //   orderItems,
    //   '',
    //   restaurantId,
    //   formData.additionalNotes,
    //   uuid
    // );
    // setCart([]);
    router.push(`/${restaurantRoute}/order/${uuid}`);

    //     await addOrder(
    //       [
    //         {
    //           quantity: 3,
    //           unit_price: 6.25,
    //           menu_item: 119, // item ID
    //         },
    //         {
    //           quantity: 2,
    //           unit_price: 14.95,
    //           menu_item: 142,
    //         },
    //       ],
    //       55, // user ID
    //       50, // restaurant ID
    //        "Some Note"
    //     )
  };

  return (
    <>
      {!restaurantData && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantData == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {/* <h1>this is a checkout page</h1>
      <Grid item xs={12}>
        <TextField
          autoComplete="phoneNum"
          required
          fullWidth
          id="phoneNum"
          label="Phone Number"
          value={formData.phoneNum}
          onChange={(event) =>
            setFormData({ ...formData, phoneNum: event.target.value.trim() })
          }
        />
      </Grid> */}

      {restaurantData && (
        <>
          <RestaurantAppBar restaurantInfo={restaurantData} />
          <Box sx={{ padding: 2 }}>
            {/* Address map */}
            <PickupLocation
              address={restaurantData.restaurant_contact.address}
            />

            {/* Name and phone number */}
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
              <Typography variant="h6">PICKUP INFO</Typography>
              <TextField
                label="Customer Name"
                value={formData.customerName}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    customerName: event.target.value.trim(),
                  })
                }
                // fullWidth
                margin="normal"
              />
              <br />
              <TextField
                label="Phone Number"
                value={formData.phoneNum}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    phoneNum: event.target.value.trim(),
                  })
                }
                // fullWidth
                margin="normal"
              />
            </Paper>

            {/* pickup details */}
            <PickupDetails cart={cart} subTotal={subTotal} />

            <Paper sx={{ marginBottom: 2, padding: 2 }}>
              <Typography variant="h6">Additional Notes</Typography>
              <TextareaAutosize
                minRows={3}
                placeholder="You can put additional notes here"
                value={formData.additionalNotes}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    additionalNotes: event.target.value.trim(),
                  })
                }
                style={{ width: '100%' }}
              />
            </Paper>
            <Typography variant="h6">
              Pay in Person ${(subTotal * 1.13).toFixed(2)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2,
                marginTop: 10,
                flexDirection: 'column',
              }}
            >
              <Button variant="outlined" color="primary" onClick={submitOrder}>
                PLACE PICKUP ORDER
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
