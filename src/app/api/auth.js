const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL

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
    })

    const responseData = await response.json()
    const item = {
      value: responseData.jwt,
      expiry: new Date().getTime() + 30 * 60000,
    }
    localStorage.setItem("authorization", JSON.stringify(item))
  } catch (e) {
    // redirect to error page
    console.error(e)
  }
}

export const loginBusiness = async (identifier, password) => {
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
    })

    const responseData = await response.json()

    if (responseData.jwt) {
      const item = {
        value: responseData.jwt,
        expiry: new Date().getTime() + 30 * 60000,
      }
      localStorage.setItem("authorization", JSON.stringify(item))
    } else {
      return "Email or password is incorrect! Please check!"
    }
  } catch (e) {
    return e
  }
}

export const checkLogin = () => {
  const itemStr = localStorage.getItem("authorization")
  console.log(itemStr)
  if (!itemStr) {
    return false
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("authorization")
    return false
  }
  return true
}

export const removeToken = () => {
  localStorage.removeItem('authorization');
}
