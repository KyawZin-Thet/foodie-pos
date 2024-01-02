import {
  CreateNewTableOptions,
  DeleteTableOptions,
  TableSlice,
  UpdateTableOptions,
} from "@/types/table";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TableSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const CreateNewTable = createAsyncThunk(
  "Table/CreateNewTable",
  async (options: CreateNewTableOptions, thunkApi) => {
    const { locationId, name, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/table`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locationId, name }),
      });
      const { createdTable } = await response.json();

      thunkApi.dispatch(addTable(createdTable));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateTable = createAsyncThunk(
  "table/updateTable",
  async (options: UpdateTableOptions, thunkApi) => {
    const { id, name, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/table`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const { updatedTable } = await response.json();

      thunkApi.dispatch(replaceTable(updatedTable));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteTable = createAsyncThunk(
  "table/deleteTable",
  async (options: DeleteTableOptions, thunkApi) => {
    const { id, onError, onSuccess } = options;
    try {
      const response = await fetch(
        `${config.backofficeApiUrl}/table?id=${id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ id }),
        }
      );
      thunkApi.dispatch(removeTable({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.items = action.payload;
    },
    addTable: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceTable: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeTable: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setTables, addTable, replaceTable, removeTable } =
  tableSlice.actions;
export default tableSlice.reducer;
