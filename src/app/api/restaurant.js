const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL;
export const addRestaurant = async (
  inputName,
  inputRoute,
  inputContactObj,
  inputDescObj,
  categoriesList,
  dishesList,
  hoursObj,
  themeObj,
  inputBusinessName,
  inputBannerImage,
  inputLogoImage
) => {
  const categoryListID = [];
  const menuItemList = [];
  let menuID;
  let restaurantData;

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
        categoryListID[index] = jsonData.data.id;
      });
  }

  // persist menu_items to database;

  for (const dish of dishesList) {
    console.log("============= Dish: ", dish);
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
          imageURL: dish.imageURL,
          discount: 0,
          counter: 0,
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        console.log(jsonData);
        menuItemList.push(jsonData.data.id);
      });
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
      menuID = jsonData.data.id;
    });

  let body = {
    data: {
      name: inputName,
      route: inputRoute,
      restaurant_contact: inputContactObj,
      restaurant_description: inputDescObj,
      menu: menuID,
      theme: themeObj,
      hours: hoursObj,
      restaurant_owner: inputBusinessName,
      bannerURL: inputBannerImage,
      logoURL: inputLogoImage,
    },
  };
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
        restaurantData = jsonData.data;
      } else {
        throw "Restaurant route need to be unique";
      }
    });
  return restaurantData;
};

export const getRestaurantByRoute = async (route) => {
  let restaurantData;
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[route][$eq]=${route}&populate[menu][populate][menu_items][populate][0]=menu_category,imageURL&populate[menu][populate]=menu_categories`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data[0];
    });
  const topPickArray =
    restaurantData.attributes.menu.data.attributes.menu_items.data;
  topPickArray.sort(function (a, b) {
    return a.attributes.counter < b.attributes.counter;
  });

  restaurantData = { ...restaurantData, "top-pick": topPickArray.slice(0, 3) };
  localStorage.setItem(
    "restaurant-data",
    JSON.stringify({
      route: route,
      themeID: restaurantData.attributes.theme.id,
    })
  );
  console.log(restaurantData);
  return restaurantData;
};

export const getRestaurantByBusinessName = async (username) => {
  let restaurantData;
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[restaurant_owner][$eq]=${username}`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data[0];
    });
  localStorage.setItem(
    "restaurant-data",
    JSON.stringify({
      route: restaurantData.attributes.route,
      themeID: restaurantData.attributes.theme.id,
    })
  );

  return restaurantData.attributes.route;
};

export const getRestaurantMenuData = async (username) => {
  let restaurantData;
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[restaurant_owner][$eq]=${username}&populate[menu][populate][menu_items][populate][0]=menu_category,imageURL&populate[menu][populate]=menu_categories`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      restaurantData = jsonData.data[0];
    });

  localStorage.setItem(
    "restaurant-data",
    JSON.stringify({
      route: restaurantData.attributes.route,
      themeID: restaurantData.attributes.theme.id,
    })
  );
  return restaurantData.attributes.menu;
};

export const updatePromotionByDish = async (dishID, discount) => {
  await fetch(`${API_BACKEND}api/menu-items/${dishID}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },

    body: JSON.stringify({
      data: {
        discount: discount,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      return jsonData.data;
    });
};

export const updateThemeID = async (username, newThemeObj) => {
  await fetch(
    `${API_BACKEND}api/restaurants/?filters[restaurant_owner][$eq]=${username}`,
    {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        data: {
          theme: newThemeObj,
        },
      }),
    }
  )
    .then((res) => res.json())
    .then((jsonData) => {
      return jsonData.data;
    });
};

export const updateRestaurantMenu = async (
  menuID,
  catRemoveList,
  catAddList,
  dishRemoveList,
  dishAddList
) => {
  const newCat = {};
  let currentCatID = [];
  let currentMenuItemID = [];

  await fetch(`${API_BACKEND}api/menus/${menuID}?populate=*`)
    .then((res) => res.json())
    .then((jsonData) => {
      currentCatID = jsonData.data.attributes.menu_categories.data.map(
        (cat) => cat.id
      );
      currentMenuItemID = jsonData.data.attributes.menu_items.data.map(
        (cat) => cat.id
      );
    });
  // persist menu_categories to database;
  for (const category of catAddList) {
    await fetch(`${API_BACKEND}api/menu-categories`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          nameCate: category,
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        newCat[category] = jsonData.data.id;
        currentCatID.push(jsonData.data.id);
      });
  }
  // TO DO loop through dishAddList -> add dish into cat (check if category id has it, then just add it with that category id, if not map it with the new category ID)
  for (const dish of dishAddList) {
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
          menu_category: dish.categoryID
            ? dish.categoryID
            : newCat[dish.categoryName],
          imageURL: dish.imageURL,
        },
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        currentMenuItemID.push(jsonData.data.id);
      });
  }
  for (const removeCatID of catRemoveList) {
    currentCatID = currentCatID.filter((cat) => cat !== removeCatID);
  }

  for (const removeDish of dishRemoveList) {
    console.log(removeDish.id);
    currentMenuItemID = currentMenuItemID.filter(
      (item) => item !== removeDish.id
    );
  }

  // update restaurant menu
  await fetch(`${API_BACKEND}api/menus/${menuID}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        menu_items: currentMenuItemID,
        menu_categories: currentCatID,
      },
    }),
  });

  // TO DO remove the category
  for (const removeCatID of catRemoveList) {
    await fetch(`${API_BACKEND}api/menu-categories/${removeCatID}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
      },
    });
  }
};
