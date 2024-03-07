"use client";
import { checkBusinessLogin } from "@/app/api/auth";
import {
  getRestaurantMenuData,
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
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

export default function EditMenuPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuCats, setMenuCats] = useState([]);
  const [catDeleteList, setCatDeleteList] = useState([]);
  const [itemDeleteList, setItemDeleteList] = useState([]);
  const [catAdd, setCatAdd] = useState([]);
  const [dishAdd, setDishAdd] = useState([]);
  const [newCateName, setNewCategoryName] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [restaurantMenuID, setRestaurantMenuID] = useState();
  const [file, setFile] = useState(null);

  useEffect(() => {
    // check user auth
    const checkLoggedIn = checkBusinessLogin();
    setIsLoggedIn(checkLoggedIn);

    // Get username from localStorage
    const storedUsername = localStorage.getItem("username");

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

  // TODO: save new category to the restaurant
  const handleSaveCategory = () => {
    if (newCateName) {
      setMenuCats([...menuCats, { name: newCateName, items: [] }]);
      setCatAdd([...catAdd, newCateName]);
    }
  };

  // TODO: delete the category to the restaurant
  const handleDeleteCategory = (event, category) => {
    event.stopPropagation();
    const updatedMenuCate = menuCats.filter((cat) => cat.name != category.name);
    setMenuCats(updatedMenuCate);
    if (category.id) {
      setCatDeleteList([...catDeleteList, category.id]);
      if (category.items.length > 0) {
        setItemDeleteList([...itemDeleteList, ...category.items]);
      }
    }
  };

  const handleSaveItem = async () => {
    const trimmedItemName = newItem.name.trim();
    const trimmedItemDescription = newItem.description.trim();
    const trimmedItemPrice = newItem.price.trim();

    if (!trimmedItemName || !trimmedItemPrice) {
      alert("Item name and price cannot be empty.");
      return;
    }

    if (activeCategory.items.some((item) => item.name === trimmedItemName)) {
      alert("An item with this name already exists in this category.");
      return;
    }

    //===========================Upload Images============================
    let uploadImage;
    const formData2 = new FormData();
    formData2.append("file", file);
    formData2.append("upload_preset", "my-uploads");

    try {
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/dyu1deqdg/image/upload",
        {
          method: "POST",
          body: formData2,
        }
      ).then((r) => r.json());
      console.log("data", data);
      console.log("image_url", data.secure_url);

      uploadImage = data.secure_url;

      if (!uploadImage) {
        console.error("Image upload failed.");
        return;
      }
    } catch (error) {
      console.error("Image upload failed.");
    }

    const updatedItem = {
      name: trimmedItemName,
      description: trimmedItemDescription,
      price: trimmedItemPrice,
      categoryID: activeCategory.id ? activeCategory.id : null,
      categoryName: activeCategory.name,
      imageURL: uploadImage,
    };

    const updatedCategories = menuCats.map((category) =>
      category.name === activeCategory.name
        ? { ...category, items: [...category.items, updatedItem] }
        : category
    );

    const updatedActiveCate = updatedCategories.find(
      (category) => category.name === activeCategory.name
    );
    setActiveCategory(updatedActiveCate);
    setMenuCats(updatedCategories);
    setDishAdd([...dishAdd, updatedItem]);
  };

  const saveMenuChange = async () => {
    await updateRestaurantMenu(
      restaurantMenuID,
      catDeleteList,
      catAdd,
      itemDeleteList,
      dishAdd
    );

    alert("Update Successfully");
  };

  const handleDeleteItem = (event, itemToDelete) => {
    event.stopPropagation();
    const updatedCategories = menuCats.map((category) =>
      category.name === activeCategory.name
        ? {
            ...category,
            items: category.items.filter(
              (item) => item.name !== itemToDelete.name
            ),
          }
        : category
    );

    const updatedActiveCate = updatedCategories.find(
      (category) => category.name === activeCategory.name
    );
    setActiveCategory(updatedActiveCate);
    setMenuCats(updatedCategories);

    if (itemToDelete.id) {
      setItemDeleteList([...itemDeleteList, { ...itemToDelete }]);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    // Use uploadedFile instead of file because file may not have been updated yet
    console.log("file", uploadedFile);
  };
  return isLoading ? (
    "Page is loading"
  ) : isLoggedIn ? (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />

      <Box sx={{ mt: 3, maxHeight: "100vh", overflow: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="new-category"
              label="New Category"
              value={newCateName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleSaveCategory}>Add Category</Button>
          </Grid>
          <Grid item xs={12}>
            <List sx={{ maxHeight: "200px", overflow: "auto" }}>
              {menuCats.map((category) => (
                <ListItem
                  button
                  onClick={() => setActiveCategory(category)}
                  key={category.name}
                >
                  <ListItemText primary={category.name} />
                  <IconButton
                    onClick={(event) => handleDeleteCategory(event, category)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          {activeCategory && (
            <Dialog open={true} onClose={() => setActiveCategory(null)}>
              <DialogTitle>{activeCategory.name} Items</DialogTitle>
              <DialogContent>
                <List sx={{ maxHeight: "200px", overflow: "auto" }}>
                  {activeCategory.items.map((item) => (
                    <ListItem key={item.name}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Description: ${item.description}, Price: ${item.price}`}
                      />
                      <IconButton
                        onClick={(event) => handleDeleteItem(event, item)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <h4>Add New Item</h4>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="item-name"
                      label="Item Name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="description"
                      label="Description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="price"
                      label="Price"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      type="file"
                      id="upload-image"
                      onChange={handleImageUpload}
                      inputProps={{
                        accept: "image/*",
                      }}
                      fullWidth
                    />
                    <br />
                    <br />
                    {newItem.imageName && (
                      <p>File Name: {newItem.imageName}</p>
                    )}{" "}
                  </Grid>
                </Grid>
                <Button onClick={handleSaveItem}>Save Item</Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setActiveCategory(null)}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Grid>
        <Button onClick={saveMenuChange}>Save Change</Button>
      </Box>
    </div>
  ) : (
    <div>
      <MainNavbar isLoggedin={isLoggedIn} />
      <p>Please log in</p>
    </div>
  );
}
