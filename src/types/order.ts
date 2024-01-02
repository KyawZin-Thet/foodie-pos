import { Addon, Menu, Order, ORDERSTATUS, Table } from "@prisma/client";
import { BaseOptions } from "./app";
import { CartItem } from "./cart";

export interface OrderSlice {
  items: Order[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateOrderOptions extends BaseOptions {
  tableId: number;
  cartItems: CartItem[];
}

export interface refreshOrderOptions extends BaseOptions {
  orderSeq: string;
}

export interface UpdateOrderOptions extends BaseOptions {
  itemId: string;
  status: ORDERSTATUS;
}

export interface OrderAddon {
  addonCategoryId: number;
  addons: Addon[];
}
export interface RefreshOrderOptions extends BaseOptions {
  orderSeq: string;
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: OrderAddon[];
  menu: Menu;
  table: Table;
}
