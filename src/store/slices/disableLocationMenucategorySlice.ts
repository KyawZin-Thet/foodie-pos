import { DisabledLocationMenuCategorySlice } from "@/types/disabledLocationMenuCategory";
import { DisabledLocationMenuCategory } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const disabledLocationMenuCategorySlice = createSlice({
  name: "disabledLocationMenuCategorySlice",
  initialState,
  reducers: {
    setDisabledLocationMenuCategories: (
      state,
      action: PayloadAction<DisabledLocationMenuCategory[]>
    ) => {
      state.items = action.payload;
    },
    removeDisabledLocationmenuCategory: (
      state,
      action: PayloadAction<{ locationId: number; menuCategoryId: number }>
    ) => {
      const { locationId, menuCategoryId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.LocationId === locationId &&
            item.menuCategoryId === menuCategoryId
          )
      );
    },
  },
});

export const {
  setDisabledLocationMenuCategories,
  removeDisabledLocationmenuCategory,
} = disabledLocationMenuCategorySlice.actions;
export default disabledLocationMenuCategorySlice.reducer;
