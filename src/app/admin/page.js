"use client";
import React, { useState, useEffect } from "react";
import { Typography, Grid, Button, Box } from "@mui/material";
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
      // First word
      setTimeout(() => setWord({ text: "Build", animation: "slide-up-in" }), 0);
      setTimeout(() => setWord({ text: "Build", animation: "stay" }), 100);
      setTimeout(
        () => setWord({ text: "Build", animation: "slide-up-out" }),
        1300
      );
      setTimeout(() => setWord({ text: "", animation: "stay" }), 1400);

      // Second word
      setTimeout(
        () => setWord({ text: "Customize", animation: "slide-up-in" }),
        1900
      );
      setTimeout(() => setWord({ text: "Customize", animation: "stay" }), 2000);
      setTimeout(
        () => setWord({ text: "Customize", animation: "slide-up-out" }),
        3200
      );
      setTimeout(() => setWord({ text: "", animation: "stay" }), 3300);

      // Third word
      setTimeout(
        () => setWord({ text: "Track orders", animation: "slide-up-in" }),
        3800
      );
      setTimeout(
        () => setWord({ text: "Track orders", animation: "stay" }),
        3900
      );
      setTimeout(
        () => setWord({ text: "Track orders", animation: "slide-up-out" }),
        5100
      );
      setTimeout(() => setWord({ text: "", animation: "stay" }), 5200);
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
          padding: "0 150px",
          marginTop: "-116px",
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={5} lg={5}>
            <Box
              sx={{
                padding: "0 20px",
                textAlign: "left",
                width: "100%",
              }}
            >
              <div className={styles.textContainer}>
                <Typography
                  component="div"
                  fontSize={"3.75rem"}
                  variant="h4"
                  sx={{
                    marginBottom: "50px",
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
                fontSize={"3.75em"}
                variant="h4"
                sx={{
                  marginBottom: "14px",
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
                    fontWeight: '600',
                    textTransform: "none",
                    color: "#050405",
                    transition:
                      "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out",

                    "&:hover": {
                      backgroundColor: "#757173",
                      color: "#fefcfc",
                      transition: "none"
                    },
                  }}
                >
                  Get started
                </Button>
                <Button
                  href="https://ood-system-frontend.vercel.app/ryo"
                  variant="contained"
                  sx={{
                    backgroundColor: "transparent",
                    border: "2px solid #bab4b6",
                    width: "122px",
                    height: "52px",
                    fontFamily: "Raleway, Arial, sans-serif",
                    fontWeight: '600',
                    textTransform: "none",
                    color: "#bab4b6",
                    transition:
                      "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(186, 180, 182, 0.33)",
                      border: "none",
                      color: "#fefcfc",
                      transition: "none"
                    },
                  }}
                >
                  See product
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={5}>
            <Box
              sx={{
                maxWidth: "100%",
                padding: "0 20px",
              }}
            >
              <Image
                src="/landingAd.jpg"
                alt="Mobile website"
                layout="responsive"
                width={580}
                height={354}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
