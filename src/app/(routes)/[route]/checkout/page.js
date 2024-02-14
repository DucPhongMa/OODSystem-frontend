"use client";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../../store";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getRestaurantByID } from "../../../api/restaurant";

export default function Checkout() {
  const [cart, setCart] = useAtom(cartAtom);
  console.log("cart:");
  console.log(cart);

  return <h1>This is Checkout</h1>;
}
