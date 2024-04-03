import React from "react";
import { Typography } from "@mui/material";
import "../../styles/animations.css";

const WaitingText = () => {
  return (
    <Typography
      variant="h7"
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: 3,
        marginBottom: 2,
      }}
    >
      Waiting for the restaurant to accept your order
      <span className="blink blink-1">.</span>
      <span className="blink blink-2">.</span>
      <span className="blink blink-3">.</span>
    </Typography>
  );
};

export default WaitingText;
