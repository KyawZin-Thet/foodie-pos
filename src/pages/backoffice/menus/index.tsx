import ItemCard from "@/components/ItemCards";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hook";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function Menus() {
  const menus = useAppSelector((store) => store.menu.items);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menus.map((menu) => (
          <Box key={menu.id}>
            <ItemCard
              href={`/backoffice/menus/${menu.id}`}
              key={menu.id}
              title={menu.name}
              icon={<LocalDiningIcon />}
            />
          </Box>
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen}></NewMenu>
    </Box>
  );
}
