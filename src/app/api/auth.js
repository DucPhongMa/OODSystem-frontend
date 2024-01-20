const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL

export const registerBusiness = async (user) => {
  try {
    const response = await fetch(`${API_BACKEND}api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        password: user.password,
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

export const loginBusiness = async (user) => {
  try {
    const response = await fetch(`${API_BACKEND}api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: user.identifier,
        password: user.password,
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
