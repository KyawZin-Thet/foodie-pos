import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOptions,
  MenuCategorySlice,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: MenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const CreateNewMenuCategory = createAsyncThunk(
  "MenuCategory/CreateNewMenuCategory",
  async (options: CreateMenuCategoryOptions, thunkApi) => {
    const { locationId, newMenuCategory, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newMenuCategory, locationId }),
      });
      const { createdMenuCategory } = await response.json();

      thunkApi.dispatch(addMenuCategory(createdMenuCategory));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateMenuCategory = createAsyncThunk(
  "MenuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, newMenuCategoryname, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, newMenuCategoryname }),
      });
      const { updatedMenuCategory } = await response.json();

      thunkApi.dispatch(replaceMenuCategory(updatedMenuCategory));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteMenuCategory = createAsyncThunk(
  "MenuCategory/deleteMenuCategory",
  async (options: DeleteMenuCategoryOptions, thunkApi) => {
    const { id, onError, onSuccess } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu-category?id=${id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ id }),
        }
      );
      thunkApi.dispatch(removeMenuCategory({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuCategorySlice = createSlice({
  name: "MenuCategory",
  initialState,
  reducers: {
    setMenuCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuCategory: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenuCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
