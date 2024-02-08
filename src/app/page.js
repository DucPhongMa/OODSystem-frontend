'use client';
import { addImage } from './api/image';
import { addRestaurant } from './api/restaurant';
import { useState, useEffect, createContext } from 'react';
import { registerBusiness, loginBusiness } from './api/auth';

export const CustomerIDContext = createContext();
export const SetCustomerIDContext = createContext();
export const RestaurantIDContext = createContext();
export const SetRestaurantIDContext = createContext();
export const CartContext = createContext();
export const SetCartContext = createContext();

export default function Home() {
  const [customerID, setCustomerID] = useState('');
  const [restaurantID, setRestaurantID] = useState('');
  const [cart, setCart] = useState([]);
  // const addToCart = () => {
  //   setCart([
  //     ...cart,
  //     {
  //       itemID:1,
  //       name: 'dish 1 name',
  //       price: 19.29,
  //       quantity: 2,
  //     },
  //   ]);
  // };

  // useEffect(() => {
  //   registerBusiness({
  //     username: "Vivy",
  //     email: "vngvy48@gmail.com",
  //     password: "password1234.",
  //   })

  //   // loginBusiness({
  //   //   username: "Vivy",
  //   //   password: "testing",
  //   // })
  // }, [])
  // return <h1>Test API Develop</h1>

  // Test Restaurant Data
  const [imageData, setImageData] = useState();
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addImage(imageData);
  };

  const handleImageFile = (event) => {
    const input = event.target;
    setImageData(input.files[0]);
  };
  return (
    <SetRestaurantIDContext.Provider value={customerID}>
      <RestaurantIDContext.Provider value={customerID}>
        <CustomerIDContext.Provider value={customerID}>
          <SetCustomerIDContext.Provider value={customerID}>
            <CartContext.Provider value={cart}>
              <SetCartContext.Provider value={cart}>
                <form onSubmit={handleSubmit}>
                  <label>
                    Image Add:
                    <input type="file" name="name" onChange={handleImageFile} />
                  </label>
                  <input type="submit" value="Submit" />
                </form>
              </SetCartContext.Provider>
            </CartContext.Provider>
          </SetCustomerIDContext.Provider>
        </CustomerIDContext.Provider>
      </RestaurantIDContext.Provider>
    </SetRestaurantIDContext.Provider>
  );
}
