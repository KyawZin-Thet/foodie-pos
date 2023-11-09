import ItemCard from "@/components/ItemCards";
import NewAddonCategory from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hook";

import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New addon category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {addonCategories.map((item) => (
          <ItemCard
            icon={<ClassIcon />}
            key={item.id}
            title={item.name}
            href={`/backoffice/addon-categories/${item.id}`}
          />
        ))}
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
