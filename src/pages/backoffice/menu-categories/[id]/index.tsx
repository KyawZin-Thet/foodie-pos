import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  deleteMenuCategory,
  updateMenuCategory,
} from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/mySnackBarSlice";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Menu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuCategoryId = Number(router.query.id);
  const [data, setData] = useState<UpdateMenuCategoryOptions>();
  const [open, setOpen] = useState<boolean>(false);

  const disabledLocationMenuCategories = useAppSelector(
    (store) => store.disabledLocationMenuCategory.items
  );
  console.log(disabledLocationMenuCategories);

  const locationId = 1; // Number(localStorage.getItem("selectedLocationId"));

  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const currentMenuCategory = menuCategories.find(
    (menuCategory) => menuCategory.id === menuCategoryId
  );

  useEffect(() => {
    if (currentMenuCategory) {
      const disabledLocationMenuCategory = disabledLocationMenuCategories.find(
        (item) =>
          item.LocationId === locationId &&
          item.menuCategoryId === menuCategoryId
      );
      setData({
        ...currentMenuCategory,
        locationId,
        isAvailable: disabledLocationMenuCategory ? false : true,
      });
    }
  }, [currentMenuCategory, disabledLocationMenuCategories]);

  if (!currentMenuCategory || !data) return null;

  const handleUpdateMenuCateogry = () => {
    dispatch(
      updateMenuCategory({
        ...data,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "Menu Cateogry Updated succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
      })
    );
  };

  const handleDeleteAddon = () => {
    dispatch(
      deleteMenuCategory({
        id: menuCategoryId,
        onSuccess: () => {
          router.push("/backoffice/menu-categories");
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "MenuCategory Deleted succcessfully.",
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
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
        defaultValue={currentMenuCategory.name}
        sx={{ mb: 2 }}
      ></TextField>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={data.isAvailable}
            onChange={(evt, value) => setData({ ...data, isAvailable: value })}
          />
        }
        label="Available"
      />

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
          onClick={handleUpdateMenuCateogry}
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
            Are u Sure U want to delete this MenuCategory?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteAddon} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
