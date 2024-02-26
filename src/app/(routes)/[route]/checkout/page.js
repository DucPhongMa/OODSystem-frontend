"use client";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../../store";
import { useState, useEffect } from "react";
import { checkCustomerLogin } from "@/app/api/auth";
import { TextField, Grid } from "@mui/material";
import { addOrder } from "@/app/api/order";
export default function Checkout() {
  const [cart, setCart] = useAtom(cartAtom);
  const [formData, setFormData] = useState({
    phoneNum: "",
  });
  console.log("cart:");
  console.log(cart);
  useEffect(() => {
    const customerInfo = checkCustomerLogin();
    if (customerInfo) {
      setFormData({ ...formData, phoneNum: JSON.parse(customerInfo).phoneNum });
    }
  }, [formData]);

  // // Sample submit order call to API
  // const submitOrder = async () => {
  //     await addOrder(
  //       [
  //         {
  //           quantity: 3,
  //           unit_price: 6.25,
  //           menu_item: 119, // item ID
  //         },
  //         {
  //           quantity: 2,
  //           unit_price: 14.95,
  //           menu_item: 142,
  //         },
  //       ],
  //       55, // user ID
  //       50, // restaurant ID
  //        "Some Note"
  //     )
  // }
  return (
    <>
      <h1>this is a checkout page</h1>
      <Grid item xs={12}>
        <TextField
          autoComplete="phoneNum"
          required
          fullWidth
          id="phoneNum"
          label="Phone Number"
          value={formData.phoneNum}
          onChange={(event) =>
            setFormData({ ...formData, phoneNum: event.target.value.trim() })
          }
        />
      </Grid>
    </>
  );
}
