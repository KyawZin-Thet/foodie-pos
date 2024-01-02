import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setOpenSnackbar } from "@/store/slices/MySnackBarSlice";
import { deleteTable, updateTable } from "@/store/slices/tableSlice";
import { UpdateTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TableDetail = () => {
  const router = useRouter();
  const tableId = Number(router.query.id);
  const tables = useAppSelector((state) => state.table.items);
  const table = tables.find((item) => item.id === tableId);
  const [data, setData] = useState<UpdateTableOptions>();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (table) {
      setData({
        id: table.id,
        name: table.name,
        locationId: table.locationId,
      });
    }
  }, [table]);

  if (!table || !data) return null;

  const handleUpdateTable = () => {
    dispatch(updateTable(data));
  };

  const handleDeleteTable = () => {
    dispatch(
      deleteTable({
        id: table.id,
        onSuccess: () => {
          dispatch(
            setOpenSnackbar({
              message: "Table Deleted succcessfully.",
              severity: "success",
              open: true,
              autoHideDuration: 3000,
            })
          );
          router.push("/backoffice/tables");
        },
      })
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Box>
      <TextField
        defaultValue={data.name}
        sx={{ mb: 2 }}
        onChange={(evt) =>
          setData({ ...data, id: table.id, name: evt.target.value })
        }
      />
      <Button
        variant="contained"
        sx={{ mt: 2, width: "fit-content" }}
        onClick={handleUpdateTable}
      >
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm delete table</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this table?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteTable}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableDetail;
