const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export const registerBusiness = async (email, password) => {
  try {
    const response = await fetch(`${API_BACKEND}api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        email: email,
        password: password,
        role: "Business",
      }),
    });

    const responseData = await response.json();
    const item = {
      value: responseData.jwt,
      expiry: new Date().getTime() + 1440 * 600000,
    };
    localStorage.setItem("business-authorization", JSON.stringify(item));
  } catch (e) {
    // redirect to error page
    console.error(e);
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await fetch(`${API_BACKEND}api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: identifier,
        password: password,
      }),
    });
    const responseData = await response.json();
    const userInfo = await fetch(`${API_BACKEND}api/users/me?populate=*`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${responseData.jwt}`,
      },
    });

    const userInfoData = await userInfo.json();
    if (responseData.jwt) {
      const item = {
        value: responseData.jwt,
        expiry: new Date().getTime() + 1440 * 600000,
        fullName: userInfoData.fullname,
        phoneNum: userInfoData.phonenumber,
      };
      if (userInfoData.role.name == "Business") {
        localStorage.setItem("business-authorization", JSON.stringify(item));
        localStorage.setItem("business-username", identifier);

      } else {
        localStorage.setItem("customer-authorization", JSON.stringify(item));
        localStorage.setItem("customer-username", identifier);

      }

    } else {
      return "Email or password is incorrect! Please check!";
    }
  } catch (e) {
    return e;
  }
};

export const checkBusinessLogin = () => {
  const itemStr = localStorage.getItem("business-authorization");
  if (!itemStr) {
    return false;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("business-authorization");
    return false;
  }
  return true;
};

export const removeToken = () => {
  localStorage.removeItem("business-authorization");
  localStorage.removeItem("business-username");
};

export const registerCustomer = async (email, password, fullName, phoneNum) => {
  try {
    const response = await fetch(`${API_BACKEND}api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        email: email,
        password: password,
        fullname: fullName,
        phonenumber: phoneNum,
      }),
    });

    const responseData = await response.json();
    const userInfo = await fetch(`${API_BACKEND}api/users/me?populate=*`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${responseData.jwt}`,
      },
    });

    const userInfoData = await userInfo.json();
    const item = {
      value: responseData.jwt,
      expiry: new Date().getTime() + 1440 * 600000,
      fullName: userInfoData.fullname,
      phoneNum: userInfoData.phonenumber,
    };
    localStorage.setItem("customer-authorization", JSON.stringify(item));
  } catch (e) {
    // redirect to error page
    console.error(e);
  }
};

export const checkCustomerLogin = () => {
  const itemStr = localStorage.getItem("customer-authorization");
  if (!itemStr) {
    return false;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("customer-authorization");
    return false;
  }
  return itemStr;
};

export const logoutCustomer = () => {
  localStorage.removeItem("customer-authorization");
};
