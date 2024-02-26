const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export const addImage = (imageData) => {
  fetch(`${API_BACKEND}upload`, {
    method: "POST",
    body: imageData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
};
