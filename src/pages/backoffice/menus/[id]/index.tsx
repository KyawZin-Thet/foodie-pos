import { useAppDispatch, useAppSelector } from "@/store/hook";
import { removeAddonCategory } from "@/store/slices/addonCategorySlice";
import { removeMenuAddonCategoryById } from "@/store/slices/menuAddonCategorySlice";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { UpdateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const MenuDetail = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menu = menus.find((item) => item.id === menuId);
  const currentMenuCategoryMenu = menuCategoryMenus.filter(
    (item) => item.menuId === menuId
  );
  const menuCategoryIds = currentMenuCategoryMenu.map(
    (item) => item.menuCategoryId
  );
  const [data, setData] = useState<UpdateMenuOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );

  useEffect(() => {
    if (menu) {
      const selectedLocationId = Number(
        localStorage.getItem("selectedLocationId")
      );
      const disabledLocationMenu = disabledLocationMenus.find(
        (item) =>
          item.locationId === selectedLocationId && item.menuId === menuId
      );
      setData({
        ...menu,
        menuCategoryIds,
        locationId: selectedLocationId,
        isAvailable: disabledLocationMenu ? false : true,
      });
    }
  }, [menu, disabledLocationMenus]);

  if (!menu || !data) return null;

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
              message: "Menu  Updated succcessfully.",
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
        id: menuId,
        onSuccess: () => {
          router.push("/backoffice/menus");
          menuAddonCategories
            .filter((item) => item.menuId === menuId)
            .map((item) => item.addonCategoryId)
            .forEach((addonCategoryId) => {
              const entries = menuAddonCategories.filter(
                (item) => item.addonCategoryId === addonCategoryId
              );
              if (entries.length === 1) {
                const menuAddonCategoryId = entries[0].id;
                dispatch(removeAddonCategory({ id: addonCategoryId }));
                dispatch(
                  removeMenuAddonCategoryById({ id: menuAddonCategoryId })
                );
              }
            });

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

  const handleMenuImageUpdate = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch(`${config.backofficeApiUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      dispatch(updateMenu({ ...data, assetUrl }));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Image
          src={menu.assetUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{ borderRadius: 8 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ width: "fit-content", mt: 2 }}
        >
          Upload File
          <input type="file" hidden onChange={handleMenuImageUpdate} />
        </Button>
      </Box>
      <TextField
        defaultValue={menu.name}
        sx={{ mb: 2 }}
        onChange={(evt) => {
          setData({ ...data, id: menuId, name: evt.target.value });
        }}
      />
      <TextField
        defaultValue={menu.price}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: menuId, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          value={data.menuCategoryIds}
          label="Menu Category"
          onChange={handleOnChange}
          renderValue={(selectedMenuCategoryIds) => {
            return selectedMenuCategoryIds
              .map((selectedMenuCategoryId) => {
                return menuCategories.find(
                  (item) => item.id === selectedMenuCategoryId
                ) as MenuCategory;
              })
              .map((item) => (
                <Chip key={item.id} label={item.name} sx={{ mr: 1 }} />
              ));
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
          onClick={handleUpdateMenu}
        >
          Update
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm delete menu</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this menu?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteMenu}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuDetail;
