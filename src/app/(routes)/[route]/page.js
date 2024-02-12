'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { getRestaurantByRoute } from '../../api/restaurant';
import RestaurantAppBar from '@/app/components/restaurant/RestaurantAppBar';
import CategoryCard from '@/app/components/restaurant/CategoryCard';
import { customerIDAtom } from '../../../../store';
import { useAtom } from 'jotai';

export default function RestaurantDetail() {
  const [restaurantData, setRestaurantData] = useState('');
  const params = useParams();
  const restaurantRoute = params.route;


  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      setRestaurantData(restaurantData.attributes);
    }

    fetchMyAPI();
  }, []);

  // console.log(restaurantData?.menu.data.attributes.menu_categories);

  console.log(restaurantData);
  // console.log(restaurantData?.menu.data.attributes);
  console.log(restaurantData?.menu?.data?.attributes.menu_categories.data);

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
      {restaurantData && (
        <>
          <RestaurantAppBar
            restaurantInfo={restaurantData}
          />
          <Image
            src="/Food_Banner.jpeg"
            alt="banner example"
            width={1500}
            height={30}
            priority={true}
          />
          {/* category */}
          <Grid container spacing={2} sx={{ margin: '20px' }}>
            {/* <Grid item xs={4}>
              <CategoryCard
                image="https://cdn12.picryl.com/photo/2016/12/31/the-cake-dessert-eating-food-drink-b83df2-1024.jpg"
                categoryName="dessert"
                handleClick={() => {
                  console.log('click category');
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <CategoryCard
                image="https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                categoryName="drink"
                handleClick={() => {}}
              />
            </Grid> */}
            {restaurantData.menu.data.attributes.menu_categories.data.map(
              (item, index) => (
                <Grid item xs={4} key={index}>
                  <CategoryCard
                    image="https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                    categoryName={item.attributes.nameCate}
                    handleClick={() => {}}
                  />
                </Grid>
              )
            )}
          </Grid>
          {/* top picks */}
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: '20px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              bgcolor: '#cfe8fc',
              maxWidth: '100%',
            }}
          >
            <Grid
              item
              xs={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                gutterBottom
                variant="h3"
                component="div"
                sx={{
                  textAlign: 'center',
                }}
              >
                TOP PICKS
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CategoryCard
                image="https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                categoryName="XXX"
                handleClick={() => {}}
                height={80}
              />
            </Grid>
          </Grid>
          {/* reviews */}
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: '20px',
              // height: '50vh',
              height: '300',
              maxWidth: '100%',
            }}
          >
            <Grid
              item
              xs={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                gutterBottom
                variant="h3"
                component="div"
                sx={{
                  textAlign: 'center',
                }}
              >
                REVIEWS
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  textAlign: 'center',
                }}
              >
                Review1
                <br />
                XXXX
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  textAlign: 'center',
                }}
              >
                Review2
                <br />
                XXXX
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  textAlign: 'center',
                }}
              >
                Review3
                <br />
                XXXX
              </Typography>
            </Grid>
          </Grid>
          {/* bottom */}
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: '20px',
              bgcolor: '#0066ff',
              // height: '60vh',
              height: '300',
              maxWidth: '100%',
            }}
          >
            <Grid
              item
              xs={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                CONTACT <br />
              </Typography>
              <Typography
                gutterBottom
                variant="h7"
                component="div"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                Phone: {restaurantData.restaurant_contact.phone}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                LOCATION <br />
              </Typography>
              <Typography
                gutterBottom
                variant="h7"
                component="div"
                sx={{
                  textAlign: 'left',
                  color: 'white',
                }}
              >
                Address: {restaurantData.restaurant_contact.address} <br />
                City:{restaurantData.restaurant_contact.city} <br />
                Postal Code: {restaurantData.restaurant_contact.postalCode}{' '}
                <br />
                Province:{restaurantData.restaurant_contact.provinceOrState}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                SUPPORT <br />
              </Typography>
              <Typography
                gutterBottom
                variant="h7"
                component="div"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                }}
              ></Typography>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
