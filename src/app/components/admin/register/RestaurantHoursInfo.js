import React from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

function RestaurantHoursInfo({ formData, setFormData }) {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  });

  const handleTimeChange = (day, timeType, newTime) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      hours: {
        ...prevFormData.hours,
        [day]: {
          ...(prevFormData.hours && prevFormData.hours[day]
            ? prevFormData.hours[day]
            : {}),
          [timeType]: newTime,
        },
      },
    }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      {days.map((day, index) => (
        <Grid container spacing={2} sx={{ mb: 1 }} key={index}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel
                id={`${day}-opening-time-label`}
                sx={{ fontSize: "0.8rem" }}
              >{`${
                day.charAt(0).toUpperCase() + day.slice(1)
              } Opening Time`}</InputLabel>
              <Select
                labelId={`${day}-opening-time-label`}
                id={`${day}-opening-time`}
                value={
                  formData.hours && formData.hours[day]
                    ? formData.hours[day].open
                    : ""
                }
                onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                sx={{ "& .MuiSelect-select": { py: 0.5, fontSize: "0.8rem" } }}
              >
                {times.map((time, timeIndex) => (
                  <MenuItem
                    value={time}
                    sx={{ fontSize: "0.8rem" }}
                    key={timeIndex}
                  >
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel
                id={`${day}-closing-time-label`}
                sx={{ fontSize: "0.8rem" }}
              >{`${
                day.charAt(0).toUpperCase() + day.slice(1)
              } Closing Time`}</InputLabel>
              <Select
                labelId={`${day}-closing-time-label`}
                id={`${day}-closing-time`}
                value={
                  formData.hours && formData.hours[day]
                    ? formData.hours[day].close
                    : ""
                }
                onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                sx={{ "& .MuiSelect-select": { py: 0.5, fontSize: "0.8rem" } }}
              >
                {times.map((time, timeIndex) => (
                  <MenuItem
                    value={time}
                    sx={{ fontSize: "0.8rem" }}
                    key={timeIndex}
                  >
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

export default RestaurantHoursInfo;
