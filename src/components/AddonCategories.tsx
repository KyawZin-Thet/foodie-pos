import { Box, Chip, Typography } from "@mui/material";
import { Addon, AddonCategory } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Addons from "./Addons";

interface Props {
  addonCategories: AddonCategory[];
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

const AddonCategories = ({
  addonCategories,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <Box>
      {addonCategories.map((item) => {
        return (
          <Box key={item.id} sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                width: "300px",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {item.name}
              </Typography>
              <Chip label={item.isRequired ? "Required" : "Optional"} />
            </Box>
            <Box sx={{ pl: 1, mt: 2 }}>
              <Addons
                addonCategoryId={item.id}
                selectedAddons={selectedAddons}
                setSelectedAddons={setSelectedAddons}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AddonCategories;
