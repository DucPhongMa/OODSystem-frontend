"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Container,
  AppBar,
  Toolbar,
  Button,
  Alert,
} from "@mui/material";
import { getRestaurantByRoute } from "../../../api/restaurant";
import ItemDialog from "@/app/components/restaurant/ItemDialog";
import ItemCard from "@/app/components/restaurant/ItemCard";
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar";
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter";
import styles from "../../../styles/RestaurantMenu.module.scss";

export default function RestaurantMenu() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCount, setItemCount] = useState(1);
  const [theme, setTheme] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
        const id = hash.substr(1).replace(/\s/g, "_");
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange, false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);

  const fetchRestaurantData = useCallback(async () => {
    const data = await getRestaurantByRoute(restaurantRoute);
    console.log(data);

    // Get open/closed status
    const status = data.attributes.status;
    if (status === "open") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    const themeID = data.attributes.theme.id;

    // For testing only
    // const themeID = 2;
    // data.attributes.theme.id = 2;

    // Set the page theme based on the themeID
    switch (themeID) {
      case 1:
        setTheme(styles.theme1);
        break;
      case 2:
        setTheme(styles.theme2);
        break;
      case 3:
        setTheme(styles.theme3);
        break;
      default:
        setTheme(styles.theme1); // Default theme
    }

    const menuItems = data.attributes.menu.data.attributes.menu_items.data.map(
      (item) => {
        return {
          name: item.attributes.name,
          price: item.attributes.price,
          imageURL: item.attributes.imageURL,
          categoryID: item.attributes.menu_category.data?.id,
          id: item.id,
          description: item.attributes.description,
          counter: item.attributes.counter,
          discount: item.attributes.counter,
        };
      }
    );

    const menuCate =
      data.attributes.menu.data.attributes.menu_categories.data.map((cat) => {
        return {
          name: cat.attributes.nameCate,
          id: cat.id,
          items: menuItems.filter((item) => item.categoryID == cat.id),
        };
      });

    setRestaurantData({ ...data.attributes, menuCate });
  }, [restaurantRoute]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const handleCategoryClick = (categoryName) => {
    if (categoryName === restaurantData.menuCate[0].name) {
      window.scrollTo(0, 0);
    } else {
      window.location.hash = categoryName.replace(/\s/g, "_");
    }
  };

  const handleOpenDialog = async (item) => {
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
    <div className={theme}>
      <Box className={`${theme} ${styles.pageBackground}`}>
        <RestaurantAppBar data={restaurantData} />

        {isOpen ? (
          <Alert severity="success" className={`${theme} ${styles.openAlert}`}>
            OPEN FOR PICKUP
          </Alert>
        ) : (
          <Alert severity="error" className={`${theme} ${styles.closedAlert}`}>
            {" "}
            CLOSED FOR PICKUP
          </Alert>
        )}

        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          className={`${theme} ${styles.appBar}`}
        >
          <Toolbar sx={{ justifyContent: "center" }}>
            {restaurantData.menuCate.map((category) => (
              <Button
                disableRipple
                key={category.id}
                variant="contained"
                onClick={() => handleCategoryClick(category.name)}
                className={`${theme} ${styles.toolbarButton}`}
              >
                {category.name.toUpperCase()}
              </Button>
            ))}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Box sx={{ mt: 3 }}>
            {restaurantData.menuCate.map((category) => (
              <Box
                key={category.name}
                id={category.name.replace(/\s/g, "_")}
                sx={{
                  mb: 4,
                  position: "relative",
                  marginTop: "-70px",
                  paddingTop: "70px",
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  className={`${theme} ${styles.categoryTypography}`}
                >
                  {category.name.toUpperCase()}
                </Typography>
                <Grid container spacing={2}>
                  {category.items.map((item) => (
                    <Grid item xs={12} sm={6} key={item.name}>
                      <ItemCard
                        item={item}
                        handleOpenDialog={handleOpenDialog}
                        theme={theme}
                      />
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
          theme={theme}
          isOpen={isOpen}
        />
      </Box>
    </div>
  );
}
