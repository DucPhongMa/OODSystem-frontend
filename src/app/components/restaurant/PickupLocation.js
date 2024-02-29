import { Box, Paper, Typography } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PickupLocation = ({ address }) => {
  return (
    <Paper sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h6">PICKUP LOCATION</Typography>
      <Typography variant="h6">{address}</Typography>
      <Box
        sx={{
          height: '200px',
          backgroundColor: "#eee",
          position: "relative",
        }}
      >
        <MapContainer
          center={[43.653, -79.3823]}
          zoom={13}
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[51.505, -0.09]}>
            <Popup>A sample popup.</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Paper>
  );
};
export default PickupLocation;
