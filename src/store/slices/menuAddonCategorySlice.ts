import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategorySlice",
  initialState,
  reducers: {
    setMenuAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategories: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuAddonCategory: (state, action) => {
      const addonCategoryId = action.payload[0].addonCategoryId;
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...action.payload];
    },
    removeMenuAddonCategoryByMenuId: (
      state,
      action: PayloadAction<{ menuId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.menuId
      );
    },
    removeMenuAddonCategoryById: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.id
      );
    },
  },
});

export const {
  setMenuAddonCategories,
  addMenuAddonCategories,
  replaceMenuAddonCategory,
  removeMenuAddonCategoryByMenuId,
  removeMenuAddonCategoryById,
} = menuAddonCategorySlice.actions;
export default menuAddonCategorySlice.reducer;
