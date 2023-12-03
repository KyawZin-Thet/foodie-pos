// src/pages/backoffice/orders/index.tsx

import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateOrder } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrders } from "@/utils/generals";
import { Box } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();

  const handleOrderStatuUpdate = (itemId: string, status: ORDERSTATUS) => {
    dispatch(updateOrder({ itemId, status }));
  };

  useEffect(() => {
    if (orders.length) {
      setOrderItems(formatOrders(orders, addons));
    }
  }, [orders]);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {orderItems.map((orderItem) => {
        return (
          <OrderCard
            key={orderItem.itemId}
            orderItem={orderItem}
            isAdmin
            handleOrderStatuUpdate={handleOrderStatuUpdate}
          />
        );
      })}
    </Box>
  );
};

export default OrdersPage;
