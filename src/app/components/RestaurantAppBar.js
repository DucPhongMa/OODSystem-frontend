import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import Image from 'next/image';

const RestaurantAppBar = ({ restaurantID }) => {
  console.log('?????');
  console.log(restaurantID);
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
            Sushi: 1 A Street, Toronto, ON
          </Typography>
        </Box>
        <Toolbar>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <div
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image src="/sushi.png" alt="sushi logo" width={100} height={100} />
            <div>
              <Typography variant="h6" component="div">
                4.5(198 ratings)
              </Typography>
              <Typography variant="body1" component="div">
                Hours 10:00 AM - 11:00 PM
              </Typography>
            </div>
          </div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantID}`}>ORDER PICKUP</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantID}/about`}>ABOUT</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantID}/reviews`}>REVIEWS</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantID}/orders`}>ORDERS</Link>
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default RestaurantAppBar;
