import { MenuCategory } from "@prisma/client";

export interface MenuCategorySlice {
  items: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface CreateMenuCategoryOptions extends BaseOptions {
  newMenuCategory: string;
  locationId: number;
}

export interface UpdateMenuCategoryOptions extends BaseOptions {
  id: number;
  newMenuCategoryname: string;
}

export interface DeleteMenuCategoryOptions extends BaseOptions {
  id: number;
}
