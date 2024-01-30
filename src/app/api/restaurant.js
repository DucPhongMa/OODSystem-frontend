const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL
export const addRestaurant = async (
  inputName,
  inputRoute,
  inputContactObj,
  inputDescObj,
  categoriesList,
  dishesList,
  hoursObj,
  themeObj
) => {
  const categoryListID = []
  const menuItemList = []
  let menuID
  let restaurantData

  // persist menu_categories to database;
  for (const [index, cateName] of categoriesList.entries()) {
    await fetch(`${API_BACKEND}api/menu-categories`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          nameCate: cateName,
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        categoryListID[index] = jsonData.data.id
      })
  }

  // persist menu_items to database;

  for (const dish of dishesList) {
    await fetch(`${API_BACKEND}api/menu-items`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          description: dish.description,
          name: dish.name,
          price: dish.price,
          menu_category: categoryListID[dish.category_id],
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        console.log(jsonData)
        menuItemList.push(jsonData.data.id)
      })
  }

  // persist menu to database
  await fetch(`${API_BACKEND}api/menus`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        menu_items: menuItemList,
        menu_categories: categoryListID,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      menuID = jsonData.data.id
    })

  let body = {
    data: {
      name: inputName,
      route: inputRoute,
      restaurant_contact: inputContactObj,
      restaurant_description: inputDescObj,
      menu: menuID,
      theme: themeObj,
      hours: hoursObj,
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
      if (jsonData.data) {
        restaurantData = jsonData.data
      } else {
        throw "Restaurant route need to be unique"
      }
    })
  return restaurantData
}

export const getRestaurantByRoute = async (route) => {
  let restaurantData
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[route][$eq]=${route}&populate[menu][populate][menu_items][populate][0]=menu_category,imageURL&populate[menu][populate]=menu_categories`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data[0]
    })
  return restaurantData
}

// TODO
// export const updateRestaurantByID = (restaurantID) => {}
