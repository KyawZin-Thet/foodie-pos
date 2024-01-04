import { BaseOptions } from "./app";

export interface MycompanyType {
  id: number;
  name: string;
  street: string;
  township: string;
  city: string;
  isArchived: boolean;
}

export interface CompanySlice {
  item: null | MycompanyType;
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateCompanyOptions extends BaseOptions {
  id: number;
  name: string;
  street: string;
  township: string;
  city: string;
}
