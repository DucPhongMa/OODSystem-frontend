import React, { useState } from "react";
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
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

function RestaurantMenuInfo({ formData, setFormData }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleSaveCategory = () => {
    const trimmedCategoryName = newCategoryName.trim();

    if (!trimmedCategoryName) {
      alert("Category name cannot be empty.");
      return;
    }

    if (
      formData.categories.some(
        (category) => category.name === trimmedCategoryName
      )
    ) {
      alert("A category with this name already exists.");
      return;
    }

    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        { name: trimmedCategoryName, items: [] },
      ],
    });
    setNewCategoryName("");
  };

  const handleDeleteCategory = (event, categoryToDelete) => {
    event.stopPropagation();
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (category) => category !== categoryToDelete
      ),
    });
  };

  const handleSaveItem = () => {
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

    const updatedItem = {
      name: trimmedItemName,
      description: trimmedItemDescription,
      price: trimmedItemPrice,
    };

    const updatedCategories = formData.categories.map((category) =>
      category.name === activeCategory.name
        ? { ...category, items: [...category.items, updatedItem] }
        : category
    );

    const updatedActiveCategory = updatedCategories.find(
      (category) => category.name === activeCategory.name
    );

    setFormData({ ...formData, categories: updatedCategories });
    setNewItem({ name: "", description: "", price: "" });
    setActiveCategory(updatedActiveCategory);
  };

  const handleDeleteItem = (event, itemToDelete) => {
    event.stopPropagation();
    const updatedCategories = formData.categories.map((category) =>
      category.name === activeCategory.name
        ? {
            ...category,
            items: category.items.filter((item) => item !== itemToDelete),
          }
        : category
    );

    const updatedActiveCategory = updatedCategories.find(
      (category) => category.name === activeCategory.name
    );

    setFormData({ ...formData, categories: updatedCategories });
    setActiveCategory(updatedActiveCategory);
  };

  return (
    <Box sx={{ mt: 3, maxHeight: "100vh", overflow: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="new-category"
            label="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleSaveCategory}>Save Category</Button>
        </Grid>
        <Grid item xs={12}>
          <List sx={{ maxHeight: "200px", overflow: "auto" }}>
            {formData.categories.map((category) => (
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
            <DialogTitle>{activeCategory.name}</DialogTitle>
            <DialogContent>
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
              </Grid>
              <Button onClick={handleSaveItem}>Save Item</Button>
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
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setActiveCategory(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Grid>
    </Box>
  );
}

export default RestaurantMenuInfo;
