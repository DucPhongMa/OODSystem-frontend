"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Image from "next/image"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { styled } from "@mui/system"

import { getRestaurantByRoute } from "../../api/restaurant"
import RestaurantAppBar from "@/app/components/restaurant/RestaurantAppBar"
import CategoryCard from "@/app/components/restaurant/CategoryCard"
import { useAtom } from "jotai"
import Link from "next/link"
import RestaurantFooter from "@/app/components/restaurant/RestaurantFooter"

export default function RestaurantDetail() {
  const [restaurantData, setRestaurantData] = useState("")
  const params = useParams()
  const restaurantRoute = params.route

  const Word = styled("div")({
    display: "inline-block",
    marginRight: "1em",
    "::first-letter": {
      fontSize: "120%",
    },
  })

  const StyledTypography = styled(Typography)({
    fontFamily: "'Roboto Slab', serif",
    fontWeight: "normal",
    fontSize: "6rem",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    "::first-letter": {
      fontSize: "120%",
    },
    paddingLeft: "1.4em",
  })

  useEffect(() => {
    async function fetchMyAPI() {
      const restaurantData = await getRestaurantByRoute(restaurantRoute)
      const menuItems =
        restaurantData.attributes.menu.data.attributes.menu_items.data.map(
          (item) => {
            return {
              name: item.attributes.name,
              price: item.attributes.price,
              imageURL: item.attributes.imageURL,
              categoryID: item.attributes.menu_category.data.id,
              id: item.id,
              description: item.attributes.description,
            }
          }
        )
      const menuCate =
        restaurantData.attributes.menu.data.attributes.menu_categories.data.map(
          (cat) => {
            const items = menuItems.filter((item) => item.categoryID == cat.id)
            return {
              name: cat.attributes.nameCate,
              id: cat.id,
              items,
              image: items[0]?.imageURL, // use the first item's image
            }
          }
        )
      setRestaurantData({ ...restaurantData.attributes, menuCate })
    }

    fetchMyAPI()
    localStorage.setItem("restaurant-route", restaurantRoute)
  }, [])

  // console.log(restaurantData?.menu.data.attributes.menu_categories);

  console.log(restaurantData)
  // console.log(restaurantData?.menu.data.attributes);
  console.log(restaurantData?.menu?.data?.attributes.menu_categories.data)

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #ffffff, #f7fafc)",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        }}
      >
        {!restaurantData && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={restaurantData == null}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {restaurantData && (
          <>
            <RestaurantAppBar restaurantInfo={restaurantData} />
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 400,
                backgroundImage: `url('/banner.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 75%, 90% 81%, 79% 85%, 65% 88%, 52% 89%, 35% 88%, 21% 85%, 10% 81%, 0 76%)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "4%",
                "::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                },
              }}
            >
              <StyledTypography
                variant="h1"
                component="h1"
                sx={{
                  position: "relative",
                  color: "#fff",
                  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
                  zIndex: 2,
                  lineHeight: 1,
                }}
              >
                {restaurantData.name.split(" ").map((word, i) => (
                  <span
                    key={i}
                    style={{ marginRight: i === 0 ? "-0.5em" : "0" }}
                  >
                    <Word key={i}>{word}</Word>
                  </span>
                ))}
              </StyledTypography>
            </Box>
            {/* Category Section */}
            <Box sx={{ margin: "30px 0", paddingBottom: "10px" }}>
              <Container maxWidth="lg">
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                >
                  {restaurantData.menuCate.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginBottom: "35px",
                          "&:hover img": {
                            filter: "brightness(0.9)",
                          },
                          "&:hover h3": {
                            color: "#333",
                          },
                        }}
                      >
                        <Link
                          href={`/${restaurantRoute}/menu#${
                            index === 0 ? "top" : item.name.replace(/\s/g, "_")
                          }`}
                          passHref
                        >
                          <Box
                            sx={{
                              marginBottom: "10px",
                              width: 250,
                              height: 250,
                              position: "relative",
                              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <Image
                              src={
                                item.image ||
                                "https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                              } // use the category image or default image
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                            />
                          </Box>
                        </Link>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          {item.name.toUpperCase()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
            {/* Top Picks Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "40px 0",
                paddingTop: "50px",
                paddingBottom: "50px",
                paddingLeft: "75px",
                paddingRight: "50px",
                position: "relative",
                backgroundImage: `url('/banner.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                "::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1,
                },
              }}
            >
              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                sx={{
                  textAlign: "left",
                  marginRight: "10px",
                  fontWeight: "bold",
                  color: "#f2f2f2",
                  zIndex: 3,
                }}
              >
                TOP PICKS
              </Typography>
              <Container
                maxWidth="lg"
                sx={{ marginLeft: "9px", zIndex: 2 }}
              >
                <Grid
                  container
                  spacing={2}
                >
                  {[1, 2, 3].map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={item}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          "&:hover img": {
                            filter: "brightness(0.9)",
                          },
                          "&:hover h3": {
                            color: "#333",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
                            width: 250,
                            height: 250,
                            position: "relative",
                          }}
                        >
                          <Image
                            src="https://images.pexels.com/photos/12516840/pexels-photo-12516840.jpeg"
                            alt={`Top Pick ${item}`}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                          />
                        </Box>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#f2f2f2",
                            marginTop: "10px",
                          }}
                        >
                          ITEM {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>

            {/* Reviews Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "40px 0",
                paddingTop: "50px",
                paddingBottom: "50px",
                paddingLeft: "75px",
                paddingRight: "50px",
              }}
            >
              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                sx={{
                  textAlign: "left",
                  marginRight: "10px",
                  fontWeight: "bold",
                  color: "#444",
                }}
              >
                REVIEWS
              </Typography>
              <Container
                maxWidth="lg"
                sx={{ marginLeft: "47px" }}
              >
                <Grid
                  container
                  spacing={2}
                >
                  {[1, 2, 3].map((review) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={review}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
                          width: 250,
                          height: 250,
                          position: "relative",
                          padding: "20px",
                          backgroundColor: "#f5f5f5",
                          "&:hover": {
                            filter: "brightness(0.95)",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{ textAlign: "center", marginBottom: "5px" }}
                        >
                          Review {review}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          sx={{ textAlign: "center" }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Vivamus lacinia odio vitae vestibulum.
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>

            <RestaurantFooter restaurantData={restaurantData} />
          </>
        )}
      </Box>
    </>
  )
}
