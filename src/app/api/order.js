const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL
export const addOrder = async (dishesArray, userID, restaurantID, note) => {
  const orderDetailIDs = []
  let orderTotal = 0
  // persist menu_items to database;

  for (const dish of dishesArray) {
    await fetch(`${API_BACKEND}api/order-details`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        data: {
          quantity: dish.quantity,
          unit_price: dish.unit_price,
          menu_item: dish.menu_item,
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        orderDetailIDs.push(jsonData.data.id)
        orderTotal += dish.unit_price * dish.quantity
      })
  }

  // persist order to database
  await fetch(`${API_BACKEND}api/orders`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        date_time: Date.now(),
        note: note,
        total_price: orderTotal,
        tax: orderTotal + orderTotal * 0.13,
        order_details: orderDetailIDs,
        restaurant: restaurantID,
        users_permissions_user: userID,
        status: "pending",
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      return jsonData
    })
}

export const getOrderBasedOnStatus = async (restaurantID, status) => {
  let orderArray
  if (status) {
    await fetch(
      `${API_BACKEND}api/orders??filters[restaurantID][$eq]=${restaurantID}&filters[status][$eq]=${status}&populate[order_details][populate][0]=menu_item&populate[users_permissions_user]=*`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        orderArray = jsonData.data
      })
  } else {
    await fetch(
      `${API_BACKEND}api/orders??filters[restaurantID][$eq]=${restaurantID}&populate[order_details][populate][0]=menu_item&populate[users_permissions_user]=*`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        orderArray = jsonData.data
      })
  }

  return orderArray
}

export const updateOrder = async (orderID, status) => {
  let updatedStatus = status.toLowerCase()
  // persist order to database
  await fetch(`${API_BACKEND}api/orders/${orderID}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        status: updatedStatus,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      return jsonData
    })
}
