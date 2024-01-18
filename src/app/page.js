"use client"
import { addImage } from "./api/image"
import { addRestaurant } from "./api/restaurant"
import { getMenuItems } from "./api/menuitem"
import { useState, useEffect } from "react"
export default function Home() {
  const [imageData, setImageData] = useState();
  const [menuItem, setMenuItem] = useState([]);

  useEffect(() => {
    async function fetchMyAPI() {
      const response = await getMenuItems();
      console.log("Menu Item data: ", response);

      // Check if the data structure is an array
      if (Array.isArray(response)) {
        setMenuItem(response);
      } else if (response.data && Array.isArray(response.data)) {
        // If data is nested within a property like 'data'
        setMenuItem(response.data);
      } else {
        console.error("Invalid data structure:", response);
      }
    }

    fetchMyAPI();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addImage(imageData);
  };

  const handleImageFile = (event) => {
    const input = event.target;
    setImageData(input.files[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Image Add:
          <input type="file" name="name" onChange={handleImageFile} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p>---------------------------------------------------------------</p>
      {menuItem.map((restaurant, index) => (
        <div key={index}>
          {/* Display or perform operations on each element */}
          <p>item Name: {restaurant.attributes.name}</p>
          <p>item description: {restaurant.attributes.description}</p>
          <p>item price: {restaurant.attributes.price}</p>
          <img src={restaurant.attributes.imageURL.data.attributes.url} alt="Item Image" /><br />
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
}
