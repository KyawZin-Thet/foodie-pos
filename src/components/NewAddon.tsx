import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createNewAddon } from "@/store/slices/addonSlice";
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
  addonCategoryId: undefined,
};

const NewAddon = ({ open, setOpen }: Props) => {
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultNewAddon);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const dispatch = useAppDispatch();

  const handleOnChange = (evt: SelectChangeEvent<number>) => {
    const selectedId = evt.target.value as number;
    setNewAddon({ ...newAddon, addonCategoryId: selectedId });
  };

  const handleCreateAddon = () => {
    dispatch(createNewAddon({ ...newAddon, onSuccess: () => setOpen(false) }));
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewAddon(defaultNewAddon);
      }}
    >
      <DialogTitle>Create new addon</DialogTitle>
      <DialogContent>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", width: 400 }}
        >
          <TextField
            placeholder="Name"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewAddon({ ...newAddon, name: evt.target.value })
            }
          />
          <TextField
            placeholder="Price"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewAddon({ ...newAddon, price: Number(evt.target.value) })
            }
          />
          <FormControl fullWidth>
            <InputLabel>Addon Category</InputLabel>
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
            <Button
              variant="contained"
              disabled={!newAddon.name || !newAddon.addonCategoryId}
              onClick={handleCreateAddon}
            >
              Confirm
            </Button>
          </Box>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
