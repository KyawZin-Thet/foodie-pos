import { useAppDispatch } from "@/store/hook";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { CreateNewTable } from "@/store/slices/tableSlice";
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

const NewTable = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const [newTable, setNewTable] = useState<string>("");

  const handleCreateTable = () => {
    const locationId = Number(localStorage.getItem("selectedLocationId"));
    if (!locationId) return null;
    dispatch(
      CreateNewTable({
        name: newTable,
        locationId,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Table Created succcessfully.",
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
      <DialogTitle>Create new Table</DialogTitle>
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
            onChange={(evt) => setNewTable(evt.target.value)}
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
            disabled={!newTable}
            onClick={handleCreateTable}
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTable;
