"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getRestaurantByID } from "../../../api/restaurant"
export default function RestaurantDetail() {
  const [restaurantName, setRestaurantName] = useState("")
  const params = useParams()
  useEffect(() => {
    const id = params.id
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByID(id)
      setRestaurantName(restaurantData.Name)
    }

    fetchMyAPI()
  }, [])
  return <h1>Restaurant Name: {restaurantName}</h1>
}
