"use client"
import { useState, useEffect } from "react"
import { getMenuItems } from "../../api/menuitem"
export default function RestaurantDetail() {
  const [restaurantName, setRestaurantName] = useState("")
  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getMenuItems()
      setRestaurantName(restaurantData.Name)
    }

    fetchMyAPI()
  }, [])
  return <h1>Restaurant Name: {restaurantName}</h1>
}
