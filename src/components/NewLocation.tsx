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
  // const company: CompanySlice = useAppSelector((state) => state.company);
  const companyId = 1;

  const [newLocation, setNewLocation] = useState({
    name: "",
    street: "",
    township: "",
    city: "",
  });
  const dispatch = useAppDispatch();

  if (!companyId) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create new location</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="Name"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            placeholder="Street"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, street: evt.target.value })
            }
          />
          <TextField
            placeholder="Township"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, township: evt.target.value })
            }
          />
          <TextField
            placeholder="City"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, city: evt.target.value })
            }
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{ width: "fit-content", mr: 2 }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={
                newLocation.name &&
                newLocation.street &&
                newLocation.township &&
                newLocation.city
                  ? false
                  : true
              }
              variant="contained"
              sx={{ width: "fit-content" }}
              onClick={() => {
                dispatch(
                  createNewLocation({
                    ...newLocation,
                    companyId,
                    onSuccess: () => setOpen(false),
                  })
                );
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
