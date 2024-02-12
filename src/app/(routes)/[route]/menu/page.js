'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Container,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getRestaurantByRoute } from '../../../api/restaurant';
import ItemDialog from '@/app/components/restaurant/ItemDialog';
import ItemCard from '@/app/components/restaurant/ItemCard';
import RestaurantAppBar from '@/app/components/restaurant/RestaurantAppBar';
import RestaurantFooter from '@/app/components/restaurant/RestaurantFooter';


export default function RestaurantMenu() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCount, setItemCount] = useState(1);
  const params = useParams();
  const restaurantRoute = params.route;

  useEffect(() => {
    if (restaurantData) {
      const { hash } = window.location;
      if (hash) {
        const id = hash.substr(1);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }
    }
  }, [restaurantData]);

  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const id = hash.substr(1);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange, false);

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute);
      const menuItems =
        restaurantData.attributes.menu.data.attributes.menu_items.data.map(
          (item) => {
            return {
              name: item.attributes.name,
              price: item.attributes.price,
              imageURL: item.attributes.imageURL,
              categoryID: item.attributes.menu_category.data.id,
              id: item.id,
              description: item.attributes.description,
            };
          }
        );
      const menuCate =
        restaurantData.attributes.menu.data.attributes.menu_categories.data.map(
          (cat) => {
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items: menuItems.filter((item) => item.categoryID == cat.id),
            };
          }
        );
      setRestaurantData({ ...restaurantData.attributes, menuCate });
    }

    fetchMyAPI();
  }, [restaurantRoute]);

  const handleCategoryClick = (categoryName) => {
    if (categoryName === restaurantData.menuCate[0].name) {
      window.scrollTo(0, 0);
    } else {
      window.location.hash = categoryName;
    }
  };

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemCount(1);
  };

  const handleItemCountChange = (change) => {
    setItemCount((prevCount) => Math.max(1, prevCount + change));
  };

  if (!restaurantData) {
    return null;
  }


  return (
    <div>
      <RestaurantAppBar
        restaurantInfo={restaurantData}
      />
      <Box sx={{ bgcolor: '#c8e6c9', py: 1, position: 'static', zIndex: 2 }}>
        <Container maxWidth="md">
          <Typography
            variant="body1"
            align="center"
            sx={{ color: '#1b5e20', fontWeight: 'bold' }}
          >
            OPEN FOR PICKUP
          </Typography>
        </Container>
      </Box>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
          zIndex: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          {restaurantData.menuCate.map((category) => (
            <Button
              key={category.id}
              variant="contained"
              onClick={() => handleCategoryClick(category.name)}
              sx={{
                margin: '0 8px',
                backgroundColor: '#e0e0e0',
                color: '#424242',
                fontWeight: 'bold',
                border: '1px solid #bdbdbd',
                boxShadow: 'none',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#bbdefb',
                  boxShadow: 'none',
                },
              }}
            >
              {category.name.toUpperCase()}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          {restaurantData.menuCate.map((category) => (
            <Box key={category.name} id={category.name} sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#4f4f4f' }}
              >
                {category.name.toUpperCase()}
              </Typography>
              <Grid container spacing={2}>
                {category.items.map((item) => (
                  <Grid item xs={12} sm={6} key={item.name}>
                    <ItemCard item={item} handleOpenDialog={handleOpenDialog} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
      <RestaurantFooter restaurantData={restaurantData} />

      <ItemDialog
        item={selectedItem}
        handleItemCountChange={handleItemCountChange}
        itemCount={itemCount}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </div>
  );
}
