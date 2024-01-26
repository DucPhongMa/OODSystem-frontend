import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';
import Image from 'next/image';

const RestaurantAppBar = ({ restaurantInfo }) => {
  // console.log(restaurantInfo);
  const currentDate = new Date();
  const dayOfWeek = currentDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  // console.log(restaurantInfo.hours);
  // console.log(restaurantInfo.hours.thursday);
  // console.log(restaurantInfo.hours[dayOfWeek].open);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            mr: 5,
            paddingTop: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ display: 'inline' }}>
            {restaurantInfo.name}: {restaurantInfo.restaurant_contact.address}
          </Typography>
        </Box>
        <Toolbar>
          <div style={{ position: 'relative', width: 240 }}>
            <Image
              src="/sushi.png"
              alt="sushi logo"
              width={100}
              height={100}
              priority={true}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 50,
                right: 40,
                color: 'white',
              }}
            >
              Hours: {restaurantInfo.hours[dayOfWeek].open} -
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: 30,
                right: 50,
                color: 'white',
              }}
            >
              {restaurantInfo.hours[dayOfWeek].close}
            </span>
            {/* <div>
              <Typography variant="h6" component="div">
                4.5(198 ratings)
              </Typography> */}
            {/* <Typography variant="body1" component="div">
              Hours 10:00 AM - 11:00 PM
            </Typography> */}
            {/* </div> */}
          </div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}`}>ORDER PICKUP</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/about`}>ABOUT</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/reviews`}>REVIEWS</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/orders`}>ORDERS</Link>
          </Typography>
          <Button color="inherit" variant="outlined">
            Log In
          </Button>
          <IconButton
            color="inherit"
            variant="outlined"
            aria-label="add to shopping cart"
          >
            <AddShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default RestaurantAppBar;
