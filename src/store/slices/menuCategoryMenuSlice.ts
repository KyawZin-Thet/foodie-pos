import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MenuCategoryMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuCategoryMenuSlice = createSlice({
  name: "menuCategoryMenuSlice",
  initialState,
  reducers: {
    setMenuCategoryMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategoryMenu: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuCategoryMenu: (state, action) => {
      const menuId = action.payload[0].menuId; // 5
      const otherMenuCategoryMenu = state.items.filter(
        (item) => item.menuId !== menuId
      );
      state.items = [...otherMenuCategoryMenu, ...action.payload];
    },
    removeMenuCategoryMenu: (
      state,
      action: PayloadAction<{ menuCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuCategoryId !== action.payload.menuCategoryId
      );
    },
  },
});

export const {
  setMenuCategoryMenus,
  addMenuCategoryMenu,
  replaceMenuCategoryMenu,
  removeMenuCategoryMenu,
} = menuCategoryMenuSlice.actions;
export default menuCategoryMenuSlice.reducer;
