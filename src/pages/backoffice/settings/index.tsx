import { useAppDispatch, useAppSelector } from "@/store/hook";

import { updateCompany } from "../../../store/slices/companySlice";

// import { setTheme } from "@/store/slices/appSlice";

import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  // const { theme } = useAppSelector((state) => state.app);
  const company = useAppSelector((state) => state.company.item);
  const [data, setData] = useState<UpdateCompanyOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      setData({
        id: company.id,
        name: company.name,
        street: company.street,
        township: company.township,
        city: company.city,
      });
    }
  }, [company]);

  if (!company || !data) return null;

  const handleUpdateCompany = () => {
    dispatch(updateCompany(data));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={theme === "dark"}
              onChange={(evt, value) => {
                const theme = value ? "dark" : "light";
                dispatch(setTheme(theme));
                localStorage.setItem("theme", theme);
              }}
            />
          }
          label="Use dark mode"
        />
      </Box> */}
      <TextField
        defaultValue={data.name}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: company.id, name: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.street}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: company.id, street: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.township}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: company.id, township: evt.target.value })
        }
      />
      <TextField
        defaultValue={data.city}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: company.id, city: evt.target.value })
        }
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateCompany}
      >
        Update
      </Button>
    </Box>
  );
};

export default SettingsPage;
