const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL
export const addRestaurant = async (
  inputName,
  inputRoute,
  inputContactObj,
  inputDescObj,
  inputMenu
) => {
  let restaurantContactID
  let restaurantDescID
  let websiteID
  let restaurantData

  // Add restaurant contact
  await fetch(`${API_BACKEND}api/restaurant-contacts`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: inputContactObj,
    }),
  })
    .then((res) => res.json())
    .then((jsonResponse) => {
      restaurantContactID = jsonResponse.data.id
    })

  await fetch(`${API_BACKEND}api/restaurant-descriptions`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: inputDescObj,
    }),
  })
    .then((res) => res.json())
    .then((jsonResponse) => {
      restaurantDescID = jsonResponse.data.id
    })

  await fetch(`${API_BACKEND}api/websites`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: { websiteURL: inputRoute },
    }),
  })
    .then((res) => res.json())
    .then((jsonResponse) => {
      websiteID = jsonResponse.data.id
    })

  let body = {
    data: {
      name: inputName,
      route: inputRoute,
      restaurant_contact: restaurantContactID,
      restaurant_description: restaurantDescID,
      website: websiteID,
      menu: null,
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

export const getRestaurantByRoute = async (route) => {
  let restaurantData
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[route][$eq]=${route}&populate=*`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data[0]
    })

  return restaurantData
}

// TODO
// export const updateRestaurantByID = (restaurantID) => {}
