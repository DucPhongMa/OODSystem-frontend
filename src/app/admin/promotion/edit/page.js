"use client";
import { checkBusinessLogin } from "@/app/api/auth";
import {
  getRestaurantMenuData,
  updatePromotionByDish,
  updateRestaurantMenu,
} from "@/app/api/restaurant";
import { useEffect, useState } from "react";
import MainNavbar from "../../../components/admin/register/MainNavbar";
import {
  Button,
  Box,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Input,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

export default function EditMenuPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuCats, setMenuCats] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [restaurantMenuID, setRestaurantMenuID] = useState();

  useEffect(() => {
    // check user auth
    const checkLoggedIn = checkBusinessLogin();
    setIsLoggedIn(checkLoggedIn);
    // Get username from localStorage
    const storedUsername = localStorage.getItem("business-username");
    setIsLoading(true);
    if (storedUsername && checkLoggedIn) {
      async function fetchMyAPI() {
        const restaurantMenu = await getRestaurantMenuData(storedUsername);

        const menuItems = restaurantMenu.data.attributes.menu_items.data.map(
          (item) => {
            return {
              name: item.attributes.name,
              price: item.attributes.price,
              imageURL: item.attributes.imageURL,
              categoryID: item.attributes.menu_category.data?.id,
              id: item.id,
              description: item.attributes.description,
              discount: item.attributes.discount,
            };
          }
        );
        const menuCate =
          restaurantMenu.data.attributes.menu_categories.data.map((cat) => {
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items: menuItems.filter((item) => item.categoryID == cat.id),
            };
          });
        setMenuCats(menuCate);
        setRestaurantMenuID(restaurantMenu.data.id);

        // console.log(menuItems)
        // console.log(restaurantData)
      }

      fetchMyAPI();
    }
    setIsLoading(false);
  }, []);

  const savePromotionsChange = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        activeCategory.items.map((dish) =>
          updatePromotionByDish(dish.id, dish.discount)
        )
      );
      console.log(activeCategory);
      setIsSaving(false);
      alert("Promotions updated successfully");
      window.location.reload();
    } catch (error) {
      setIsSaving(false);
      console.error("Failed to update promotions:", error);
      alert("Failed to update promotions. Please try again.");
    }
  };

  return isLoading ? (
    "Page is loading"
  ) : isLoggedIn ? (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <Box sx={{ mt: 3, maxHeight: "100vh", overflow: "auto" }}>
        <Select
          value={activeCategory ? activeCategory.name : ""}
          onChange={(e) => {
            const selectedCategory = menuCats.find(
              (cat) => cat.name === e.target.value
            );
            console.log(selectedCategory);
            setActiveCategory(selectedCategory);
          }}
          displayEmpty
          fullWidth
          sx={{ width: "100%" }}
        >
          <MenuItem value="" disabled>
            Select a Category
          </MenuItem>
          {menuCats.map((category) => (
            <MenuItem key={category.name} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {activeCategory && (
          <List
            sx={{ maxHeight: "400px", overflow: "auto", width: "100%", mt: 3 }}
          >
            {activeCategory.items.map((item) => (
              <ListItem key={item.name} sx={{ borderBottom: "1px solid #ccc" }}>
                <ListItemText
                  primary={item.name}
                  secondary={`Description: ${item.description}, Price: ${item.price}`}
                />
                <TextField
                  label="Promotion (%)"
                  type="number"
                  value={item.discount || 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 && value <= 10) {
                      const updatedItems = activeCategory.items.map((i) =>
                        i === item ? { ...i, discount: parseInt(value, 10) } : i
                      );
                      setActiveCategory({
                        ...activeCategory,
                        items: updatedItems,
                      });
                    }
                  }}
                  inputProps={{
                    min: 0,
                    max: 10,
                  }}
                  sx={{ width: "20%" }}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button onClick={savePromotionsChange} sx={{ mt: 3 }}>
          {isSaving ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
    </div>
  ) : (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <p>Please log in</p>
    </div>
  );
}
