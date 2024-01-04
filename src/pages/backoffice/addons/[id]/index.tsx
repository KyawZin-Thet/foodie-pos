import { useAppDispatch, useAppSelector } from "@/store/hook";
import { deleteAddon, updateAddon } from "@/store/slices/addonSlice";
import { setOpenSnackbar } from "@/store/slices/mySnackBarsSlice";
import { UpdateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
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
import { AddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Menu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addonId = Number(router.query.id);
  const [data, setData] = useState<UpdateAddonOptions>();
  const [open, setOpen] = useState<boolean>(false);

  const addons = useAppSelector((store) => store.addon.items);
  const addonCategories = useAppSelector((store) => store.addonCategory.items);
  const currentAddon = addons.find((addon) => addon.id === addonId);

  useEffect(() => {
    if (currentAddon) {
      setData({ ...currentAddon });
    }
  }, [currentAddon]);

  if (!currentAddon || !data) return null;
  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    const selectedId = evt.target.value as number;
    setData({ ...data, addonCategoryId: selectedId });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateAddon({
        ...data,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "Addon Updated succcessfully.",
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
      deleteAddon({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addons");
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Addon Deleted succcessfully.",
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
        defaultValue={currentAddon.name}
        sx={{ mb: 2 }}
      ></TextField>
      <TextField
        onChange={(evt) =>
          setData({ ...data, price: Number(evt.target.value) })
        }
        defaultValue={currentAddon.price}
        sx={{ mb: 2 }}
      ></TextField>
      <FormControl fullWidth>
        <InputLabel>Addon Category</InputLabel>
        <Select
          value={data.addonCategoryId}
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
            Are u Sure U want to delete this addon?
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
