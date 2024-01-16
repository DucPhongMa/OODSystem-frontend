const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL
export const addRestaurant = async (restaurantName) => {
  let restaurantData
  let body = {
    data: {
      Name: restaurantName,
    },
  }

  await fetch(`${API_BACKEND}api/restaurants`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data
    })
  return restaurantData
}

export const getRestaurantByID = async (restaurantID) => {
  let restaurantData
  await fetch(`${API_BACKEND}api/restaurants/${restaurantID}`)
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data
    })

  return restaurantData.attributes
}

// TODO
// export const updateRestaurantByID = (restaurantID) => {}
