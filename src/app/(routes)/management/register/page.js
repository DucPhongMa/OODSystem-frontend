"use client"
import { addRestaurant } from "@/app/api/restaurant"
import { useState, useEffect } from "react"

export default function RegisterBusiness() {
  // Test Restaurant Data
  const [newRestaurantName, setRestaurantName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [menuName, setMenuName] = useState("")
  const [themeId, setThemeID] = useState("")
  const [restaurantObj, setRestarantObj] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const handleStep1 = async (event) => {
    event.preventDefault()
    setCurrentStep(2)

    const newObject = {
      name: newRestaurantName,
    }

    setRestarantObj(newObject)
    // const restaurantData = await addRestaurant(newRestaurantName)
  }

  const handleStep2 = async (event) => {
    event.preventDefault()
    setCurrentStep(3)
    const newObject = {
      ...restaurantObj,
      ownerName: ownerName,
    }

    setRestarantObj(newObject)
  }

  const handleStep3 = async (event) => {
    event.preventDefault()
    setCurrentStep(4)

    const newObject = {
      ...restaurantObj,
      menuName: event.target.menu.value,
    }

    setRestarantObj(newObject)
  }

  const handleStep4 = async (event) => {
    event.preventDefault()
    setCurrentStep(5)

    const newObject = {
      ...restaurantObj,
      themeID: event.target.theme.value,
    }

    setRestarantObj(newObject)
  }

  const submitRestaurant = async () => {
    const newRestaurantValue = await addRestaurant(restaurantObj.name)
  }

  return (
    <>
      <button onClick={() => setCurrentStep(1)}>Step 1</button>
      <button onClick={() => setCurrentStep(3)}>Step 3</button>

      <h1>Current Step: {currentStep}</h1>
      {currentStep == 1 && (
        <form onSubmit={handleStep1}>
          <label>
            Restaurant Name:
            <input
              type="text"
              name="name"
              value={newRestaurantName}
              onChange={(e) => setRestaurantName(e.currentTarget.value)}
            />
          </label>
          <input
            type="submit"
            value="Submit"
          />
        </form>
      )}

      {currentStep == 2 && (
        <form onSubmit={handleStep2}>
          <label>
            Restaurant Owner:
            <input
              type="text"
              name="name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.currentTarget.value)}
            />
          </label>
          <input
            type="submit"
            value="Submit"
          />
        </form>
      )}

      {currentStep == 3 && (
        <form onSubmit={handleStep3}>
          <label>
            Restaurant Menu:
            <input
              type="text"
              name="menu"
              value={restaurantObj.menuName && restaurantObj.menuName}
              onChange={(e) => setMenuName(e.currentTarget.value)}
            />
          </label>
          <input
            type="submit"
            value="Submit"
          />
        </form>
      )}

      {currentStep == 4 && (
        <form onSubmit={handleStep4}>
          <label>
            Restaurant Theme:
            <input
              type="text"
              name="theme"
              value={themeId}
              onChange={(e) => setThemeID(e.currentTarget.value)}
            />
          </label>
          <input
            type="submit"
            value="Submit"
          />
        </form>
      )}

      {currentStep == 5 && (
        <div>
          <p>Restaurant Name: {restaurantObj.name}</p>
          <p>Restaurant Owner Name: {restaurantObj.ownerName}</p>
          <p>Restaurant Menu: {restaurantObj.menuName}</p>
          <p>Restaurant ThemeID: {restaurantObj.themeID}</p>
          <button onClick={submitRestaurant}>Submit</button>
        </div>
      )}
    </>
  )
}
