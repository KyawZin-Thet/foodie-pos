import { useAppDispatch } from "@/store/hook";
import { createNewLocation } from "@/store/slices/locationSlice";
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

const NewLocation = ({ open, setOpen }: Props) => {
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });
  const dispatch = useAppDispatch();
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new Location</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
            placeholder="Name"
            sx={{ mb: 2 }}
          ></TextField>
          <TextField
            onChange={(evt) =>
              setNewLocation({ ...newLocation, address: evt.target.value })
            }
            placeholder="Address"
            sx={{ mb: 2 }}
          ></TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            sx={{ width: "fit-content", mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={newLocation.name && newLocation.address ? false : true}
            variant="contained"
            sx={{ width: "fit-content" }}
            onClick={() => {
              dispatch(
                createNewLocation({
                  ...newLocation,
                  onSuccess: () => setOpen(false),
                })
              );
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
