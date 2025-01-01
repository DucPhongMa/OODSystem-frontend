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
  Input,
  useMediaQuery,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import Image from "next/image";

function RestaurantMenuInfo({ formData, setFormData }) {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  const [activeCategory, setActiveCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [file, setFile] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    imageName: "", // Added state for image name
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

  const handleSaveItem = async (e) => {
    e.preventDefault();
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
    var uploadImage = "";
    var formData2 = null;
    if (file) {
      formData2 = new FormData();
      formData2.append("file", file);
      formData2.append("upload_preset", "my-uploads");
    }

    try {
      if (file) {
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
      }

      // Update newItem state with imageName
      setNewItem({ ...newItem, imageName: uploadImage });
      //============================================================================

      const updatedItem = {
        name: trimmedItemName,
        description: trimmedItemDescription,
        price: trimmedItemPrice,
        imageName: uploadImage,
      };

      const updatedCategories = formData.categories.map((category) =>
        category.name === activeCategory.name
          ? { ...category, items: [...category.items, updatedItem] }
          : category
      );

      setFormData({
        ...formData,
        categories: updatedCategories,
      });

      setActiveCategory((prevActiveCategory) => {
        const updatedActiveCategory = updatedCategories.find(
          (category) => category.name === prevActiveCategory.name
        );
        return updatedActiveCategory || null;
      });

      // Reset input fields after save
      setNewItem({
        name: "",
        description: "",
        price: "",
        imageName: "",
      });
    } catch (error) {
      console.error(error);
    }
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

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }

    // Use uploadedFile instead of file because file may not have been updated yet
    console.log("file", uploadedFile);
  };

  return (
    <Box sx={{ mt: 3, width: "100%", px: 2 }}>
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
                {/* File Upload Input */}
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
                  {/* Display file name */}
                </Grid>
                {/* End File Upload Input */}
              </Grid>
              <Button onClick={handleSaveItem}>Save Item</Button>
              <List sx={{ maxHeight: "200px", overflow: "auto" }}>
                {activeCategory.items.map((item) => (
                  <ListItem key={item.name}>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          <div>Description: {item.description}</div>
                          <div>Price: {item.price}</div>
                          <div>
                            Image Name:{" "}
                            <Image
                              src={item.imageName ? item.imageName : ""}
                              alt="Item Image"
                              style={{ maxWidth: "120px", maxHeight: "120px" }}
                              width={120}
                              height={120}
                            />
                          </div>
                        </>
                      }
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
