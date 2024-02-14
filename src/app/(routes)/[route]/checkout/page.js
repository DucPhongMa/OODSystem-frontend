"use client"
import { useAtom } from "jotai"
import { cartAtom } from "../../../../../store"
import { useState, useEffect } from "react"
import { checkCustomerLogin } from "@/app/api/auth"
import { TextField, Grid } from "@mui/material"
export default function Checkout() {
  const [cart, setCart] = useAtom(cartAtom)
  const [formData, setFormData] = useState({
    phoneNum: "",
  })
  console.log("cart:")
  console.log(cart)
  useEffect(() => {
    const customerInfo = checkCustomerLogin()
    if (customerInfo) {
      setFormData({ ...formData, phoneNum: JSON.parse(customerInfo).phoneNum })
    }
  }, [])
  return (
    <>
      <h1>this is a checkout page</h1>
      <Grid
        item
        xs={12}
      >
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
  )
}
