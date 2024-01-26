'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import Grid from '@mui/material/Grid';

import { getRestaurantByRoute } from '../../api/restaurant';
import RestaurantAppBar from '@/app/components/RestaurantAppBar';
import CategoryCard from '@/app/components/CategoryCard';

export default function RestaurantDetail() {
  const [restaurantData, setRestaurantData] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams()
  const restaurantRoute = params.route;

  useEffect(() => {
    async function fetchMyAPI() {

      const restaurantData = await getRestaurantByRoute(restaurantRoute)
      setRestaurantData(restaurantData.attributes);
      setIsLoading(false);
      console.log(restaurantData)

    }

    fetchMyAPI();
  }, []);

  // console.log(restaurantInfo?.menu.data.attributes.menu_categories?.data);
  console.log(restaurantData?.menu.data.attributes);

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantInfo == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && (
        <>
          <RestaurantAppBar restaurantInfo={restaurantInfo} />
          <Image
            src="/Food_Banner.jpeg"
            alt="banner example"
            width={1500}
            height={30}
            priority={true}
          />
          {/* category */}
          <Grid container spacing={2} sx={{ margin: '20px' }}>
            <Grid item xs={4}>
              <CategoryCard
                image="https://cdn12.picryl.com/photo/2016/12/31/the-cake-dessert-eating-food-drink-b83df2-1024.jpg"
                categoryName="dessert"
                handleClick={() => {console.log()}}
              />
            </Grid>
            <Grid item xs={4}>
              <CategoryCard
                image="https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                categoryName="drink"
                handleClick={() => {}}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
