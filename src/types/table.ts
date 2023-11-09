import { Table } from "@prisma/client";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface TableSliceOptions extends BaseOptions {}

export interface CreateNewTableOptions extends BaseOptions {
  name: string;
  locationId: number;
}

export interface UpdateTableOptions extends BaseOptions {
  id: number;
  name: string;
  locationId: number;
}

export interface DeleteTableOptions extends BaseOptions {
  id: number;
}
