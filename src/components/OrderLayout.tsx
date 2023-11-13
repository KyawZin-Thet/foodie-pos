import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const OrderLayout = ({ children }: Props) => {
  return <Box>{children}</Box>;
};

export default OrderLayout;
