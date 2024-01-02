import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createNewMenu, setLoadingMenu } from "@/store/slices/menuSlice";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";

import { CreateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
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
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import FileDropZone from "./FileDropZone";

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
  const [newMenu, setNewMenu] = useState<CreateMenuOptions>(defaultNewMenu);
  const { isLoading } = useAppSelector((state) => state.menu);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const dispatch = useAppDispatch();
  const [menuImage, setMenuImage] = useState<File>();

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    const selectedIds = evt.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };

  const handleCreateMenu = async () => {
    dispatch(setLoadingMenu(true));
    const newMenuPayload = { ...newMenu };

    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage);
      const response = await fetch(`${config.backofficeApiUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      newMenuPayload.assetUrl = assetUrl;
    }

    dispatch(
      createNewMenu({
        ...newMenuPayload,
        onSuccess: () => {
          setOpen(false);
          dispatch(setLoadingMenu(false));
          dispatch(
            setOpenSnackbar({
              message: "addon category Created succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
        },
        onError: () => {
          dispatch(
            setOpenSnackbar({
              message: "Error occurred when creating menu.",
              autoHideDuration: 2000,
              severity: "error",
            })
          );
          dispatch(setLoadingMenu(false));
        },
      })
    );
  };

  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setNewMenu(defaultNewMenu);
        setOpen(false);
      }}
    >
      <DialogTitle>Create new menu</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", width: 400 }}
      >
        <TextField
          placeholder="Name"
          sx={{ mb: 2 }}
          onChange={(evt) => setNewMenu({ ...newMenu, name: evt.target.value })}
        />
        <TextField
          placeholder="Price"
          sx={{ mb: 2 }}
          onChange={(evt) =>
            setNewMenu({ ...newMenu, price: Number(evt.target.value) })
          }
        />
        <FormControl fullWidth>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            value={newMenu.menuCategoryIds}
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
                <Checkbox checked={newMenu.menuCategoryIds.includes(item.id)} />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <FileDropZone onFileSelected={onFileSelected} />
          {menuImage && (
            <Chip
              sx={{ mt: 2 }}
              label={menuImage.name}
              onDelete={() => setMenuImage(undefined)}
            />
          )}
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={!newMenu.name || !newMenu.menuCategoryIds.length}
            onClick={handleCreateMenu}
          >
            Confirm
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
