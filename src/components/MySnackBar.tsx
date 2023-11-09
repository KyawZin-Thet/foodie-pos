// src/components/Snackbar.tsx

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { resetSnackbar } from "@/store/slices/MySnackBarSlice";
import { Alert, Snackbar as MuiSnackBar } from "@mui/material";

const Snackbar = () => {
  const dispatch = useAppDispatch();
  const { open, severity, message, autoHideDuration } = useAppSelector(
    (state) => state.snackBar
  );

  setTimeout(() => dispatch(resetSnackbar()), autoHideDuration);
  return (
    <MuiSnackBar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert variant="filled" severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackBar>
  );
};

export default Snackbar;
