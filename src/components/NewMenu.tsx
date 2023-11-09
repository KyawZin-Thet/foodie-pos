import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createNewMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { CreateMenuOptions } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewMenu = {
  name: "",
  price: 0,
  menuCategoryIds: [],
};

const NewMenu = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const [newMenu, setNewMenu] = useState<CreateMenuOptions>(defaultNewMenu);
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const selectedIds = event.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };

  const handleConfirm = () => {
    dispatch(
      createNewMenu({
        ...newMenu,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Menu Created succcessfully.",
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
              setNewMenu({ ...newMenu, name: evt.target.value })
            }
            sx={{ mb: 2, width: "250px" }}
          ></TextField>
          <TextField
            placeholder="price"
            sx={{ mb: 2, width: "250px" }}
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
          ></TextField>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-checkbox-label">
            MenuCateogies
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={newMenu.menuCategoryIds}
            onChange={handleChange}
            input={<OutlinedInput label="MenuCateogies" />}
            renderValue={(selected) =>
              selected.map((id) =>
                menuCategories
                  .filter((mc) => mc.id === id)
                  .map((smc) => (
                    <Chip key={smc.id} label={smc.name} sx={{ mr: 1 }} />
                  ))
              )
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {menuCategories.map((menuCategory) => (
              <MenuItem key={menuCategory.id} value={menuCategory.id}>
                <Checkbox
                  checked={newMenu.menuCategoryIds.includes(menuCategory.id)}
                />
                <ListItemText primary={menuCategory.name} />
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
          <Button onClick={handleConfirm} variant="contained">
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
