import { MenuCategoryMenu } from "@prisma/client";

export interface menuCategoryMenuSlice {
  items: MenuCategoryMenu[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface MenuCategoryMenueOptions extends BaseOptions {}
