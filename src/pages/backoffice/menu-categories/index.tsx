import ItemCard from "@/components/ItemCards";
import NewMenuCategory from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hook";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function MenuCategories() {
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const [open, setOpen] = useState(false);

  if (!menuCategories) return null;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Menu Category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {menuCategories.map((menuCategory) => (
          <ItemCard
            icon={<CategoryIcon />}
            key={menuCategory.id}
            title={menuCategory.name}
            href={`/backoffice/menu-categories/${menuCategory.id}`}
          />
        ))}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
}
