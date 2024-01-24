"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getRestaurantByRoute } from "../../api/restaurant"
export default function RestaurantDetail() {
  const [restaurantData, setRestaurantData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  useEffect(() => {
    const restaurantRoute = params.route
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute)
      setRestaurantData(restaurantData.attributes)
      setIsLoading(false)
      console.log(restaurantData)
    }

    fetchMyAPI()
  }, [])
  return isLoading ? (
    <div>Is loading</div>
  ) : (
    <h1>Restaurant Name: {restaurantData.name}</h1>
  )
}
