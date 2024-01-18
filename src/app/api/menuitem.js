const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL
export const getMenuItems = async () => {
    let restaurantData
    await fetch(`${API_BACKEND}api/menu-items?populate=*`)
      .then((res) => res.json())
      .then((jsonData) => {
        console.log("Menu Item jsonData: ", jsonData)
        restaurantData = jsonData.data
      })
  
    return restaurantData
  }