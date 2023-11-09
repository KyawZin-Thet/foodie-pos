import ItemCard from "@/components/ItemCards";
import NewAddon from "@/components/NewAddon";
import { useAppSelector } from "@/store/hook";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function Addons() {
  const [open, setOpen] = useState(false);
  const addons = useAppSelector((store) => store.addon.items);

  if (!addons) return null;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {addons.map((addon) => (
          <ItemCard
            icon={<EggIcon />}
            key={addon.id}
            title={addon.name}
            href={`/backoffice/addons/${addon.id}`}
          />
        ))}
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
}
