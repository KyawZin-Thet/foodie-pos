import { Addon } from "@prisma/client";

export interface AddonSlice {
  items: Addon[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface AddonSliceOptions extends BaseOptions {}

export interface CreateAddonOptions extends BaseOptions {
  name: string;
  price: number;
  addonCategoryId: number;
}

export interface UpdateAddonOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  addonCategoryId: number;
}

export interface DeleteAddonOptions extends BaseOptions {
  id: number;
}
