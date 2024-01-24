"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getRestaurantByRoute } from "../../api/restaurant"
import RestaurantAppBar from "@/app/components/RestaurantAppBar"

export default function RestaurantDetail() {
  const [restaurantName, setRestaurantName] = useState("")
  const params = useParams()
    useEffect(() => {
    const restaurantRoute = params.route
    async function fetchMyAPI() {
      // not work right now because backend need to add field
      const restaurantData = await getRestaurantByRoute(restaurantRoute)
      console.log(restaurantData)
      setRestaurantName(restaurantData.attributes.name)
    }

    fetchMyAPI()
  }, [])

  return (
    <>
      <RestaurantAppBar restaurantID={restaurantName} />
    </>
  );
}