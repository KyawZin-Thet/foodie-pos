import { useAppDispatch } from "@/store/hook";
import { createNewMenuCategory } from "@/store/slices/menuCategorySlice";
import { setOpenSnackbar } from "@/store/slices/mySnackBarsSlice";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewMenuCategory = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const handleCreateMenuCategory = () => {
    const currentLocationId = localStorage.getItem("selectedLocationId");
    dispatch(
      createNewMenuCategory({
        locationId: Number(currentLocationId),
        name,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Menu Category Created succcessfully.",
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
            onChange={(evt) => setName(evt.target.value)}
            sx={{ mb: 2, width: "250px" }}
          ></TextField>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!name}
            onClick={handleCreateMenuCategory}
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenuCategory;
