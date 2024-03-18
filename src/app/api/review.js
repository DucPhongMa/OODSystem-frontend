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
