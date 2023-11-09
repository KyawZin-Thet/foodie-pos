import {
  CreateMenuOptions,
  DeleteMenuOptions,
  MenuSlice,
  UpdateMenuOptions,
} from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addNewMenuCategoryMenu,
  replaceMenuCategoryMenu,
} from "./menuCategoryMenuSlice";

const initialState: MenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewMenu = createAsyncThunk(
  "menu/createMenu",
  async (options: CreateMenuOptions, thunkApi) => {
    const { name, price, menuCategoryIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, menuCategoryIds }),
      });
      const { createdMenu, menuCategoryMenus } = await response.json();
      thunkApi.dispatch(addNewMenu(createdMenu));
      thunkApi.dispatch(addNewMenuCategoryMenu(menuCategoryMenus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async (options: UpdateMenuOptions, thunkApi) => {
    const { id, menuCategoryIds, name, price, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, menuCategoryIds }),
      });
      const { menu, menuCategoryMenus } = await response.json();
      thunkApi.dispatch(replaceMenu(menu));
      thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu?id=${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      thunkApi.dispatch(removeMenu({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action) => {
      state.items = action.payload;
    },
    addNewMenu: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenu: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenu: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setMenus, addNewMenu, replaceMenu, removeMenu } =
  menuSlice.actions;
export default menuSlice.reducer;
