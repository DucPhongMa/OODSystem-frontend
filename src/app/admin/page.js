import { AppBar, Toolbar, Typography, Grid, Button } from "@mui/material"
import Link from "next/link"
import MainNavbar from "../../components/admin/register/MainNavbar"

export default function landing() {
  const gridStyle = {
    display: "flex",
    padding: "10px",
    paddingTop: "90px",
  }

  return (
    <>
      {/* Navbar */}
      <MainNavbar isLoggedin={false}/>

      {/* Body */}
      <Grid
        style={gridStyle}
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
          container
          justifyContent={"center"}
        >
          <div style={{ textAlign: "center" }}>
            <Typography
              fontSize={"55px"}
              variant="h4"
              style={{ marginBottom: "50px" }}
            >
              Welcome to [App Name]
            </Typography>
            <Typography
              fontSize={"30px"}
              variant="paragraph"
            >
              We will help you generate a static website and provide you an
              efficient way to handle pick-up orders.
              <br></br>
              All we need is your business information.
            </Typography>
          </div>
          <Grid item>
            <Button
              href="/admin/login"
              variant="contained"
              style={{
                backgroundColor: "#1976d2",
                marginRight: "150px",
                width: "200px",
                height: "65px",
              }}
            >
              Login
            </Button>
            <Button
              href="/admin/register"
              variant="contained"
              style={{
                backgroundColor: "#1976d2",
                width: "200px",
                height: "65px",
              }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={6}
          container
          justifyContent={"center"}
        >
          <img
            src="https://picsum.photos/650/600"
            alt="placeholder image"
            width={650}
            height={600}
          />{" "}
          {/* A landing picture */}
        </Grid>
        <Grid
          item
          xs={6}
          container
          justifyContent={"center"}
        >
          <img
            src="https://picsum.photos/650/600"
            alt="placeholder image"
            width={650}
            height={600}
          />{" "}
          {/* An about me picture? What does that mean? */}
        </Grid>
        <Grid
          item
          xs={6}
          container
          justifyContent={"center"}
        >
          <div style={{ textAlign: "center" }}>
            <Typography
              fontSize={"28px"}
              variant="h4"
              style={{ margin: "25px" }}
            >
              About Us
            </Typography>
            <Typography
              maxWidth={"550px"}
              style={{ marginBottom: "50px" }}
            >
              We at [App Name] understand the frustration many restaurant owners
              face in today's digitally dependant world. The lack of a
              fast-loading website and an efficient online pickup ordering
              system can be a significant hurdle.
            </Typography>
            <Typography maxWidth={"550px"}>
              Many restaurants lack a fast-loading website and menu or a method
              for customers to create pickup orders online. In today’s world,
              customers increasingly prefer to order meals online and pick up
              quickly rather than wait in line to order. Our objective is to
              generate an attractive website with a pickup order option for any
              restaurant owner that registers with our service. Like web
              services such as Blogger or WordPress where users can sign up and
              create a personal blog within minutes, our solution allows
              restaurant owners to sign up for a new restaurant website. The
              website is customizable and even comes with a pickup order system.
              Customers will be able to register an account with our service and
              make pickup orders on any restaurant website created with our
              service. They will also be able to access a variety of features
              such as favorites, recommendations, reviews, chatbots, complaints,
              location and routes, and more.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </>
  )
}
