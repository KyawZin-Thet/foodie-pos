import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id;
  const orders = useAppSelector((state) => state.order.items);
  const totalPrice = orders.length && orders[0].totalPrice;
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const orderItems = formatOrders(orders, addons,);
  const dispatch = useAppDispatch();
  let intervalId: number | null;

  useEffect(() => {
    if (orderSeq) {
      intervalId = window.setInterval(fetchOrderStatus, 3000);
    }
    return () => {
      intervalId && window.clearInterval(intervalId);
    };
  }, [orderSeq]);

  const fetchOrderStatus = () => {
    dispatch(refreshOrder({ orderSeq: String(orderSeq) }));
  };

  return (
    <Box sx={{ position: "relative", top: 150, zIndex: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
          mx: 3,
        }}
      >
        <Typography>OrderSeq: {orderSeq}</Typography>
        <Typography>Total price: {totalPrice}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
