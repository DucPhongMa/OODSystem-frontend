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

  // await addOrder(
  //   "145587sdaw", -> need to be a string
  //   [
  //     {
  //       quantity: 3,
  //       unit_price: 6.95,
  //       menu_item: 106, // item ID
  //     },
  //     {
  //       quantity: 2,
  //       unit_price: 15.95,
  //       menu_item: 117,
  //     },
  //   ],
  //   50, // restaurant ID
  //   "Some Note", -> need to be a string
  //   "vivy vuong", -> need to be a string (or null for logged in user)
  //   "4371459857", -> need to be a string (or null for logged in user)
  //   null // user ID -> need to be null for non-logged in user and need to be user id for logged in user
  // );

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
