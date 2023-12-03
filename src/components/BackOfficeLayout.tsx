import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import SideBar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

const BackofficeLayout = ({ children }: Props) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const { theme } = useAppSelector((state) => state.app);
  const { init } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (session && !init) {
      dispatch(fetchAppData({}));
    }
    if (!session) {
      router.push("/backoffice");
    }
  }, [session]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Topbar />
      <Box sx={{ display: "flex", position: "relative", zIndex: 5, flex: 1 }}>
        {session && (
          <Box
            sx={{ minHeight: "100vh", display: { xs: "none", sm: "block" } }}
          >
            <SideBar />
          </Box>
        )}
        <Box
          sx={{
            p: 3,
            width: "100%",
            minHeight: "100%",
            backgroundColor: "info.main",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
