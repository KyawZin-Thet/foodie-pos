import {
  AddonSlice,
  CreateAddonOptions,
  DeleteAddonOptions,
  UpdateAddonOptions,
} from "@/types/addon";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewAddon = createAsyncThunk(
  "addon/createAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/addon`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const { createdAddon } = await response.json();
      thunkApi.dispatch(addNewAddon(createdAddon));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateAddon = createAsyncThunk(
  "menu/updateMenu",
  async (options: UpdateAddonOptions, thunkApi) => {
    const { id, addonCategoryId, name, price, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/addon`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, addonCategoryId }),
      });
      const { updatedAddon } = await response.json();

      thunkApi.dispatch(replaceAddon(updatedAddon));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteAddon = createAsyncThunk(
  "menu/deleteMenu",
  async (options: DeleteAddonOptions, thunkApi) => {
    const { id, onError, onSuccess } = options;
    try {
      const response = await fetch(
        `${config.backofficeApiUrl}/addon?id=${id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ id }),
        }
      );
      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const addonSlice = createSlice({
  name: "Addon",
  initialState,
  reducers: {
    setAddons: (state, action) => {
      state.items = action.payload;
    },
    addNewAddon: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddon: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddon: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setAddons, addNewAddon, replaceAddon, removeAddon } =
  addonSlice.actions;
export default addonSlice.reducer;
