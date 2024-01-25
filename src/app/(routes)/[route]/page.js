'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';

import { getRestaurantByRoute } from '../../api/restaurant';
import RestaurantAppBar from '@/app/components/RestaurantAppBar';

export default function RestaurantDetail() {
  // const [restaurantName, setRestaurantName] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState();
  const params = useParams();
  const restaurantRoute = params.route;

  useEffect(() => {
    async function fetchMyAPI() {
      // not work right now because backend need to add field
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      console.log(restaurantData);
      setRestaurantInfo(restaurantData.attributes);
      // setRestaurantName(restaurantData.attributes.name);
    }

    fetchMyAPI();
  }, []);

  // console.log(restaurantInfo);
  return (
    <>
      {!restaurantInfo && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={restaurantInfo == null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {restaurantInfo && (
        <>
          <RestaurantAppBar restaurantInfo={restaurantInfo} />
          <Image
            src="/Food_Banner.jpeg"
            alt="banner example"
            width={1500}
            height={30}
          />
        </>
      )}
    </>
  );
}
