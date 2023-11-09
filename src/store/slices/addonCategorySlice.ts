import {
  AddonCategorySlice,
  CreateAddonCategoriesOption,
  DeleteAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategories,
  replaceMenuAddonCategory,
} from "./menuAddonCategorySlice";

const initialState: AddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewAddonCategory = createAsyncThunk(
  "addonCategory/createNewAddonCategory",
  async (options: CreateAddonCategoriesOption, thunkApi) => {
    const { menuIds, isRequired, name, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, isRequired, menuIds }),
      });
      const data = await response.json();
      const { addonCategory, menuAddonCategories } = data;

      thunkApi.dispatch(addNewAddonCategory(addonCategory));
      thunkApi.dispatch(addMenuAddonCategories(menuAddonCategories));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateAddonCategory = createAsyncThunk(
  "addonCategory/updateAddonCategory",
  async (options: UpdateAddonCategoryOptions, thunkApi) => {
    const { menuIds, id, isRequired, name, onError, onSuccess } = options;

    try {
      const response = await fetch(`${config.apiBaseUrl}/addon-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, isRequired, menuIds }),
      });
      const { updatedAddonCategory, menuAddonCategories } =
        await response.json();

      thunkApi.dispatch(replaceAddonCategory(updatedAddonCategory));
      thunkApi.dispatch(replaceMenuAddonCategory(menuAddonCategories));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteAddonCategory = createAsyncThunk(
  "addonCategory/deleteAddonCategory",
  async (options: DeleteAddonCategoryOptions, thunkApi) => {
    const { id, onError, onSuccess } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/addon-category?id=${id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ id }),
        }
      );
      thunkApi.dispatch(removeAddonCategory({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const addonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addNewAddonCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddonCategory: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddonCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setAddonCategories,
  addNewAddonCategory,
  removeAddonCategory,
  replaceAddonCategory,
} = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
