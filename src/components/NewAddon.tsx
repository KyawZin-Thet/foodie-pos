import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createNewAddon } from "@/store/slices/addonSlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { CreateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AddonCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultNewAddon = {
  name: "",
  price: 0,
  addonCategoryId: 0,
};

const NewAddon = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultNewAddon);

  const addonCategories = useAppSelector((store) => store.addonCategory.items);

  if (!addonCategories) return null;

  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    setNewAddon({ ...newAddon, addonCategoryId: Number(evt.target.value) });
  };

  const handleCreateAddon = () => {
    const isValid = newAddon.name && newAddon.addonCategoryId;
    if (!isValid) {
      return dispatch(
        setOpenSnackbar({
          message: "Missing required fields",
          severity: "error",
        })
      );
    }
    dispatch(
      createNewAddon({
        ...newAddon,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "addon Created succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
      })
    );
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new menu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Name"
            onChange={(evt) =>
              setNewAddon({ ...newAddon, name: evt.target.value })
            }
            sx={{ mb: 2, width: "250px" }}
          ></TextField>
          <TextField
            placeholder="price"
            sx={{ mb: 2, width: "250px" }}
            onChange={(evt) =>
              setNewAddon({ ...newAddon, price: Number(evt.target.value) })
            }
          ></TextField>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-checkbox-label">
            Addon Categories
          </InputLabel>
          <Select
            value={newAddon.addonCategoryId}
            label="Addon Category"
            onChange={handleOnChange}
            renderValue={(selectedAddonCategoryId) => {
              return (
                addonCategories.find(
                  (item) => item.id === selectedAddonCategoryId
                ) as AddonCategory
              ).name;
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {addonCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateAddon} variant="contained">
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
