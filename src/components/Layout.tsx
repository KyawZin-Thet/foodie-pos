import { Box } from "@mui/material";
import { useRouter } from "next/router";

import BackOfficeLayout from "./BackOfficeLayout";
import OrderLayout from "./OrderLayout";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { companyId, tableId } = router.query;
  const isBackOfffice = router.pathname === "/backoffice";
  const isOrder = companyId && tableId;

  if (isBackOfffice) {
    return (
      <Box sx={{ height: "100%" }}>
        <BackOfficeLayout>{children} </BackOfficeLayout>
      </Box>
    );
  } else if (isOrder) {
    <Box sx={{ height: "100%" }}>
      <OrderLayout> {children} </OrderLayout>
    </Box>;
  } else {
    <Box sx={{ height: "100%" }}>
      <Box> {children}</Box>
    </Box>;
  }
};

export default Layout;
