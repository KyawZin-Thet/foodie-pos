import { menuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { MenuCategoryMenu } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

const initialState: menuCategoryMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuCategoryMenu = createSlice({
  name: "menuCategoryMenu",
  initialState,
  reducers: {
    setMenuCategoryMenu: (state, action) => {
      state.items = action.payload;
    },
    addNewMenuCategoryMenu: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuCategoryMenu: (state, action) => {
      const menuId = action.payload[0].menuId; // 5
      const otherMenuCategoryMenus: MenuCategoryMenu[] = state.items.filter(
        (item) => item.menuId !== menuId
      );
      state.items = [...otherMenuCategoryMenus, ...action.payload];
    },
  },
});

export const {
  setMenuCategoryMenu,
  addNewMenuCategoryMenu,
  replaceMenuCategoryMenu,
} = menuCategoryMenu.actions;
export default menuCategoryMenu.reducer;
