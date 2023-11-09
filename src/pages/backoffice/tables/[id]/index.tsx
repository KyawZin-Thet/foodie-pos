import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { deleteTable, updateTable } from "@/store/slices/tableSlice";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";

import { useRouter } from "next/router";
import { useState } from "react";

export default function Tables() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tableId = Number(router.query.id);
  const [newTable, setNewTable] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const tables = useAppSelector((store) => store.table.items);

  const currentTable = tables.find((table) => table.id === tableId);

  if (!currentTable) return null;

  const handleUpdateMenu = () => {
    const locationId = Number(localStorage.getItem("selectedLocationId"));
    if (!locationId) return null;
    dispatch(
      updateTable({
        id: tableId,
        name: newTable,
        locationId,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "table Updated succcessfully.",
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
      deleteTable({
        id: tableId,
        onSuccess: () => {
          router.push("/backoffice/menu-categories");
          setOpen(false);
          dispatch(
            setOpenSnackbar({
              message: "Table Deleted succcessfully.",
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
    <Box>
      <TextField
        onChange={(evt) => setNewTable(evt.target.value)}
        defaultValue={currentTable.name}
        sx={{ mb: 2 }}
      ></TextField>

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
            Are u Sure U want to delete this Table?
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
