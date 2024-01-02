import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppFooter from "./OrderAppFooter";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = (props: Props) => {
  const { isLoading } = useAppSelector((state) => state.app);
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "auto",
        bgcolor: "info.main",
        pb: { xs: 10, md: 0 },
      }}
    >
      <OrderAppHeader />
      <Box>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: 200,
            }}
          >
            <CircularProgress size={80} />
          </Box>
        ) : (
          props.children
        )}
      </Box>
      <OrderAppFooter />
    </Box>
  );
};

export default OrderLayout;
