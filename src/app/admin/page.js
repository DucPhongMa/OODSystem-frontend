"use client";
import React, { useState, useEffect } from "react";
import { Typography, Grid, Button, Box, Container } from "@mui/material";
import MainNavbar from "../components/admin/register/LandingNavbar";
import styles from "../styles/AdminLanding.module.scss";
import Image from "next/image";

export default function Landing() {
  const [word, setWord] = useState({
    text: "Build",
    animation: "slide-up-in",
  });

  // Word animation
  useEffect(() => {
    const cycleWords = () => {
      setTimeout(
        () =>
          setWord({ text: "Build", animation: "slide-up-in", visible: true }),
        0
      );
      setTimeout(
        () => setWord({ text: "Build", animation: "stay", visible: true }),
        100
      );
      setTimeout(
        () =>
          setWord({ text: "Build", animation: "slide-up-out", visible: false }),
        1300
      );
      setTimeout(
        () => setWord({ text: " ", animation: "stay", visible: false }),
        1400
      );

      setTimeout(
        () =>
          setWord({
            text: "Customize",
            animation: "slide-up-in",
            visible: true,
          }),
        1900
      );
      setTimeout(
        () => setWord({ text: "Customize", animation: "stay", visible: true }),
        2000
      );
      setTimeout(
        () =>
          setWord({
            text: "Customize",
            animation: "slide-up-out",
            visible: false,
          }),
        3200
      );
      setTimeout(
        () => setWord({ text: " ", animation: "stay", visible: false }),
        3300
      );

      setTimeout(
        () =>
          setWord({
            text: "Track orders",
            animation: "slide-up-in",
            visible: true,
          }),
        3800
      );
      setTimeout(
        () =>
          setWord({ text: "Track orders", animation: "stay", visible: true }),
        3900
      );
      setTimeout(
        () =>
          setWord({
            text: "Track orders",
            animation: "slide-up-out",
            visible: false,
          }),
        5100
      );
      setTimeout(
        () => setWord({ text: " ", animation: "stay", visible: false }),
        5200
      );
    };

    cycleWords();
    const intervalId = setInterval(cycleWords, 5700);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={styles.container}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <MainNavbar isLoggedin={false} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: -8,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            padding: 0,
            maxWidth: {
              xs: "80%",
              sm: "80%",
              md: "90%",
              lg: "90%",
              xl: "80%",
            },
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Box>
                <div className={styles.textContainer}>
                  <Typography
                    component="div"
                    fontSize={{ xs: "2rem", sm: "3.75rem" }}
                    variant="h4"
                    sx={{
                      fontFamily: "Raleway, Arial, sans-serif",
                      fontWeight: 600,
                      color: "#92888b",
                    }}
                    className={`${styles.animatedText} ${styles[word.animation]}`}
                  >
                    {word.text}
                  </Typography>
                </div>
                <Typography
                  fontSize={{ xs: "2rem", sm: "3.75rem" }}
                  variant="h4"
                  sx={{
                    marginBottom: { xs: "5px", sm: "14px" },
                    fontFamily: "Raleway, Arial, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Restaurante Wiz
                </Typography>
                <Typography
                  fontSize={"1.2rem"}
                  variant="body1"
                  sx={{
                    fontFamily: "Raleway, Arial, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Transform your restaurant into a stunning website with a
                  built-in pickup order system and advanced design features
                  &mdash; just a click away.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "33px",
                    fontFamily: "Raleway, Arial, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  <Button
                    href="/admin/register"
                    variant="contained"
                    sx={{
                      backgroundColor: "#bab4b6",
                      marginRight: "9px",
                      width: "122px",
                      height: "52px",
                      fontFamily: "Raleway, Arial, sans-serif",
                      fontWeight: "600",
                      textTransform: "none",
                      color: "#050405",
                      transition:
                        "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out",

                      "&:hover": {
                        backgroundColor: "#757173",
                        color: "#fefcfc",
                        transition: "none",
                      },
                    }}
                  >
                    Get started
                  </Button>
                  <Button
                    href="https://ood-system-frontend.vercel.app/ryo"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    sx={{
                      backgroundColor: "transparent",
                      border: "2px solid #bab4b6",
                      width: "122px",
                      height: "52px",
                      fontFamily: "Raleway, Arial, sans-serif",
                      fontWeight: "600",
                      textTransform: "none",
                      color: "#bab4b6",
                      transition:
                        "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(186, 180, 182, 0.33)",
                        border: "none",
                        color: "#fefcfc",
                        transition: "none",
                      },
                    }}
                  >
                    See product
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box>
                <Image
                  src="/landingAd.jpg"
                  alt="Mobile website"
                  width={580}
                  height={354}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}
