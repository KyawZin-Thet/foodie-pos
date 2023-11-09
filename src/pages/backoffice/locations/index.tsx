import ItemCard from "@/components/ItemCards";
import NewLocation from "@/components/NewLocation";
import { useAppSelector } from "@/store/hook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function Locations() {
  const locations = useAppSelector((store) => store.location.items);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            icon={<LocationOnIcon />}
            title={location.name}
          ></ItemCard>
        ))}
        <NewLocation open={open} setOpen={setOpen}></NewLocation>
      </Box>
    </Box>
  );
}
