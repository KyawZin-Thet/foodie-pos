import { useAppSelector } from "@/store/hook";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Settings() {
  const locations = useAppSelector((store) => store.location.items);
  const [locationId, setLocationId] = useState("");
  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        setLocationId(selectedLocationId);
      } else {
        const firstLocationId = locations[0].id;
        setLocationId(String(firstLocationId));
        localStorage.setItem("selectedLocationId", String(firstLocationId));
      }
    }
  }, [locations]);

  const handleChange = (event: SelectChangeEvent) => {
    setLocationId(event.target.value);
    localStorage.setItem("selectedLocationId", String(event.target.value));
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 420 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Location</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={locationId}
            label="location"
            onChange={handleChange}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
