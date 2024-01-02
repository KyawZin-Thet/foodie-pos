import MenuCard from "@/components/MenuCard";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hook";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenusPage = () => {
  const [open, setOpen] = useState(false);
  const menus = useAppSelector((state) => state.menu.items);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New menu
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {menus.map((item) => {
          const exist = disabledLocationMenus.find(
            (disabledLocationMenu) =>
              disabledLocationMenu.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disabledLocationMenu.menuId === item.id
          );
          const isAvailable = exist ? false : true;
          return (
            <MenuCard
              href={`/backoffice/menus/${item.id}`}
              key={item.id}
              menu={item}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenusPage;
