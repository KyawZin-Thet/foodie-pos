import { AddonCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface AddonCategorySlice {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface addonCategorySliceOptions extends BaseOptions {}

export interface CreateAddonCategoriesOption extends BaseOptions {
  name: string;
  isRequired?: boolean;
  menuIds: number[];
}

export interface UpdateAddonCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  isRequired?: boolean;
  menuIds: number[];
}

export interface DeleteAddonCategoryOptions extends BaseOptions {
  id: number;
}
