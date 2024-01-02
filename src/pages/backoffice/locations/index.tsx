import ItemCard from "@/components/ItemCards";
import NewLocation from "@/components/NewLocation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSelectedLocation } from "@/store/slices/locationSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState(false);
  const { items: locations, selectedLocation } = useAppSelector(
    (state) => state.location
  );
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {locations.map((item) => (
          <ItemCard
            key={item.id}
            icon={<LocationOnIcon fontSize="large" />}
            title={item.name}
            selected={item.id === selectedLocation?.id}
            onClick={() => {
              dispatch(setSelectedLocation(item));
              localStorage.setItem("selectedLocationId", String(item.id));
            }}
          />
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
