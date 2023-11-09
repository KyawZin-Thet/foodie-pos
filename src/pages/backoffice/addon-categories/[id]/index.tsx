import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  deleteAddonCategory,
  updateAddonCategory,
} from "@/store/slices/addonCategorySlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { UpdateAddonCategoryOptions } from "@/types/addonCategory";
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
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AddonCategory, Menu, MenuAddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AddonCategories() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addonCategoryId = Number(router.query.id);
  const menuAddonCategories: MenuAddonCategory[] = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const addonCategories = useAppSelector((store) => store.addonCategory.items);
  const menus = useAppSelector((store) => store.menu.items);
  const addonCategory = addonCategories.find(
    (item: AddonCategory) => item.id === addonCategoryId
  );

  const currentMenuAddonCategories: MenuAddonCategory[] =
    menuAddonCategories.filter(
      (item) => item.addonCategoryId === addonCategoryId
    );
  const menuIds: number[] = currentMenuAddonCategories.map(
    (item) => item.menuId
  );
  const [data, setData] = useState<UpdateAddonCategoryOptions>();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (addonCategory) {
      setData({ ...addonCategory, menuIds });
    }
  }, [addonCategory]);
  if (!addonCategory || !data) return null;

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const menuIds = evt.target.value as number[];
    setData({ ...data, menuIds });
  };
  const handleUpdateaddonCategory = () => {
    dispatch(
      updateAddonCategory({
        ...data,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "addon category Updated succcessfully.",
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
      deleteAddonCategory({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addon-categories");
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "addon category Deleted succcessfully.",
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
    <Box>
      <TextField defaultValue={addonCategory.name}></TextField>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={addonCategory.isRequired}
            onChange={(evt, value) => setData({ ...data, isRequired: value })}
          />
        }
        label="Required"
        sx={{ mt: 1 }}
      />
      <FormControl fullWidth>
        <InputLabel>addonCategory</InputLabel>
        <Select
          multiple
          value={data.menuIds}
          onChange={handleOnChange}
          label="addonCategory"
          renderValue={(selectedMenuIds) => {
            return selectedMenuIds
              .map(
                (selectedMenuId: number) =>
                  menus.find((item) => item.id === selectedMenuId) as Menu
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
          {menus.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuIds.includes(item.id)} />
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
          onClick={handleUpdateaddonCategory}
        >
          Update
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are u Sure U want to delete this menu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteMenu} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
