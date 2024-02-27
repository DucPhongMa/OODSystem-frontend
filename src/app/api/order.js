const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL;
export const addOrder = async (
  matchID,
  dishesArray,
  restaurantID,
  note,
  username,
  phoneNumber,
  userID
) => {
  const orderDetailIDs = [];
  let orderTotal = 0;
  let userCheckIn;
  let submittedOrder;
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
        orderDetailIDs.push(jsonData.data.id);
        orderTotal += dish.unit_price * dish.quantity;
      });
  }

  if (userID) {
    userCheckIn = true;
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
        time_placed: Date.now(),
        note: note,
        matchID: matchID,
        total_price: orderTotal,
        tax: 0.13,
        order_details: orderDetailIDs,
        restaurant: restaurantID,
        users_permissions_user: userCheckIn ? userID : null,
        username: userCheckIn ? null : username,
        phone_number: userCheckIn ? null : phoneNumber,
        status: "pending",
        checkID: uuid,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      submittedOrder = jsonData;
    });

  return submittedOrder;
};

export const getOrderByUUID = async (uuid) => {
  let order;
  await fetch(
    `${API_BACKEND}api/orders?filters[matchID][$eq]=${uuid}&populate[order_details][populate][0]=menu_item&populate[users_permissions_user]=*`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      order = jsonData.data[0];
    });

  return order;
};

export const getOrderBasedOnStatus = async (restaurantID, status) => {
  let orderArray;
  if (status) {
    await fetch(
      `${API_BACKEND}api/orders??filters[restaurantID][$eq]=${restaurantID}&filters[status][$eq]=${status}&populate[order_details][populate][0]=menu_item&populate[users_permissions_user]=*`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        orderArray = jsonData.data;
      });
  } else {
    await fetch(
      `${API_BACKEND}api/orders??filters[restaurantID][$eq]=${restaurantID}&populate[order_details][populate][0]=menu_item&populate[users_permissions_user]=*`
    )
      .then((res) => res.json())
      .then((jsonData) => {
        orderArray = jsonData.data;
      });
  }

  return orderArray;
};

export const updateOrder = async (orderID, status) => {
  let updatedStatus = status.toLowerCase();
  let timeComplete;

  if (status == "completed" || status == "cancelled") {
    timeComplete = Date.now();
  }
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
        time_completed: timeComplete ? timeComplete : null,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      return jsonData;
    });
};

export const getOrderByCustomer = async () => {
  const token = localStorage.getItem("customer-authorization");
  const tokenData = JSON.parse(token);
  const jwtToken = tokenData.value;
  console.log(jwtToken);
  const userInfo = await fetch(
    `${API_BACKEND}api/users/me?populate=orders&populate=orders.order_details.menu_item`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  const userInfoData = await userInfo.json();

  return userInfoData.orders;
};

export const getOrderById = async (orderId) => {
  let orderDetailData;
  await fetch(
    `${API_BACKEND}api/orders/${orderId}?populate=users_permissions_user&populate=order_details.menu_item&populate=restaurant`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      console.log("jsonData: ", jsonData);
      orderDetailData = jsonData.data.attributes;
    });

  return orderDetailData;
};
