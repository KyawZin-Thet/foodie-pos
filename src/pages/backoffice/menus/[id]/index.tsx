import { useAppDispatch, useAppSelector } from "@/store/hook";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { UpdateMenuOptions } from "@/types/menu";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Menu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuId = Number(router.query.id);
  const [data, setData] = useState<UpdateMenuOptions>();
  const [open, setOpen] = useState<boolean>(false);

  const menus = useAppSelector((store) => store.menu.items);
  const menuCategories = useAppSelector((store) => store.menuCategory.items);

  const menuCategoryMenus = useAppSelector(
    (store) => store.menuCategoryMenu.items
  );
  const currentMenuCategoryMenu = menuCategoryMenus.filter(
    (item) => item.menuId === menuId
  );
  const menuCategoryIds = currentMenuCategoryMenu.map((i) => i.menuCategoryId);
  const currentMenu = menus.find((menu) => menu.id === menuId);

  useEffect(() => {
    if (currentMenu) {
      setData({ ...currentMenu, menuCategoryIds });
    }
  }, [currentMenu]);

  if (!currentMenu || !data) return null;
  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setData({ ...data, id: menuId, menuCategoryIds: selectedIds });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateMenu({
        ...data,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "Menu Updated succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
      })
    );
  };

  const handleDeleteMenu = () => {
    dispatch(
      deleteMenu({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/menus");
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Menu Deleted succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        onChange={(evt) =>
          setData({ ...data, id: menuId, name: evt.target.value })
        }
        defaultValue={currentMenu.name}
        sx={{ mb: 2 }}
      ></TextField>
      <TextField
        onChange={(evt) =>
          setData({ ...data, id: menuId, price: Number(evt.target.value) })
        }
        defaultValue={currentMenu.price}
        sx={{ mb: 2 }}
      ></TextField>
      <FormControl fullWidth>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          value={data.menuCategoryIds}
          onChange={handleOnChange}
          label="Menu Category"
          renderValue={(selectedmenuCategoryIds) => {
            return selectedmenuCategoryIds
              .map(
                (selectedmenuCategoryId) =>
                  menuCategories.find(
                    (item) => item.id === selectedmenuCategoryId
                  ) as MenuCategory
              )
              .map((i) => <Chip key={i.id} label={i.name} sx={{ mr: 1 }} />);
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
          {menuCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuCategoryIds.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="contained"
          color="error"
          sx={{ m: 2, width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          sx={{ m: 2, width: "fit-content" }}
          onClick={handleUpdateMenu}
        >
          Update
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are u Sure U want to delete this menu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteMenu} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
