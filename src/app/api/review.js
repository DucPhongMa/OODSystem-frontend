const API_BACKEND = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export const getAllReviews = async (restaurantRoute) => {
  let reviews;
  await fetch(
    `${API_BACKEND}api/reviews?filters[restaurant][route][$eq]=${restaurantRoute}&populate=*`
  )
    .then((res) => res.json())
    .then((jsonData) => {
      reviews = jsonData.data;
    });

  return reviews;
};

export const addReviews = async (
  customerName,
  rating,
  reviewText,
  restaurantId
) => {
  let submittedReviews;

  await fetch(`${API_BACKEND}api/reviews`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        customerName: customerName,
        reviewContent: reviewText,
        rating: rating,
        restaurant: restaurantId,
      },
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      submittedReviews = jsonData;
    });

  return submittedReviews;
};
