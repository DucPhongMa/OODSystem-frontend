import React from "react";
import { Button, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const ActionButtons = ({ status, orderId, onActionClick }) => {
  const theme = useTheme();

  // Button click event that stops propagation and executes the action
  const handleButtonClick = (newStatus, event) => {
    event.stopPropagation(); // Prevent row click event
    onActionClick(newStatus, orderId);
  };

  return (
    <>
      {(status === "new" || status === "pending") && (
        <Button
          key="accept"
          variant="contained"
          onClick={(e) => handleButtonClick("in progress", e)}
          sx={{
            mr: 1,
            backgroundColor: (theme) =>
              `${theme.palette.warning.light} !important`,
            "&:hover": {
              backgroundColor: (theme) =>
                `${theme.palette.warning.main} !important`,
            },
          }}
        >
          Accept
        </Button>
      )}
      {status === "pending" && (
        <Button
          key="cancel"
          variant="outlined"
          onClick={(e) => handleButtonClick("cancelled", e)}
          sx={{
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              borderColor: theme.palette.error.dark,
            },
          }}
        >
          Cancel
        </Button>
      )}
      {status === "in progress" && (
        <Button
          key="readyForPickup"
          variant="contained"
          onClick={(e) => handleButtonClick("ready for pickup", e)}
          sx={{
            backgroundColor: (theme) =>
              `${theme.palette.success.light} !important`,
            "&:hover": {
              backgroundColor: (theme) =>
                `${theme.palette.success.main} !important`,
            },
            "&:hover": {
              backgroundColor: theme.palette.info.dark,
            },
          }}
        >
          Ready for Pickup
        </Button>
      )}
      {(status === "ready pick up" || status === "ready for pickup") && (
        <Button
          key="completed"
          variant="contained"
          onClick={(e) => handleButtonClick("completed", e)}
          sx={{
            backgroundColor: (theme) => `${theme.palette.info.main} !important`,
            "&:hover": {
              backgroundColor: (theme) =>
                `${theme.palette.info.dark} !important`,
            },
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Complete
        </Button>
      )}
    </>
  );
};

export default ActionButtons;
