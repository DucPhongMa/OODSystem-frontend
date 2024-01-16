"use client"
import { addImage } from "./api/image"
import { addRestaurant } from "./api/restaurant"
import { useState } from "react"
export default function Home() {
  // const [newRestaurantName, setRestaurantName] = useState("")
  // const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   const restaurantData = await addRestaurant(newRestaurantName)
  //   console.log(`http://localhost:3000/restaurant/${restaurantData.id}`)
  // }
  // return (
  //   <form onSubmit={handleSubmit}>
  //     <label>
  //       Restaurant Name:
  //       <input
  //         type="text"
  //         name="name"
  //         value={newRestaurantName}
  //         onChange={(e) => setRestaurantName(e.currentTarget.value)}
  //       />
  //     </label>
  //     <input
  //       type="submit"
  //       value="Submit"
  //     />
  //   </form>
  // )
  // formData.append("files", imageFile) // imageFile is the image to be uploaded

  const [imageData, setImageData] = useState()
  const handleSubmit = async (event) => {
    event.preventDefault()
    await addImage(imageData)
  }

  const handleImageFile = (event) => {
    // const formData = new FormData()
    const input = event.target
    // const files = input.files[0]
    // console.log(files)
    setImageData(input.files[0])
    // formData.append("files", input.files) // imageFile is the image to be uploaded
    // console.log(formData)
    // setImageData(formData)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Image Add:
        <input
          type="file"
          name="name"
          onChange={handleImageFile}
        />
      </label>
      <input
        type="submit"
        value="Submit"
      />
    </form>
  )
}
