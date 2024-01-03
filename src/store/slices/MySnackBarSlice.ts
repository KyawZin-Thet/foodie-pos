import { SnackBarSlice } from "@/types/mySnackBar";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackBarSlice = {
  open: false,
  message: null,
  autoHideDuration: 5000,
  severity: "success",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setOpenSnackbar: (state, action) => {
      const { autoHideDuration, message, severity } = action.payload;
      state.open = true;
      state.message = message;
      state.autoHideDuration = autoHideDuration;
      state.severity = severity;
    },
    resetSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenSnackbar, resetSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
