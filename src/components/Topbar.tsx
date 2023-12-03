import { useAppSelector } from "@/store/hook";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import SideBar from "./Sidebar";

const Topbar = () => {
  const { data } = useSession();
  // const { theme } = useAppSelector((state) => state.app);
  const { selectedLocation } = useAppSelector((state) => state.location);
  const [openDrawer, setOpenDrawer] = useState(false);
  const showLocation = data && selectedLocation;

  return (
    <Box
      sx={{
        bgcolor: "success.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
      }}
    >
      <Box sx={{ height: 70 }}>
        <Image src={"/logo.png"} alt="logo" width={150} height={70} />
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <Typography variant="h5" color={"secondary"}>
          Foodie POS
        </Typography>
        {showLocation && (
          <Typography color={"secondary"} sx={{ fontSize: 12 }}>
            {selectedLocation?.name}
          </Typography>
        )}
      </Box>
      {data ? (
        <Box>
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon sx={{ fontSize: "30px", color: "#E8F6EF" }} />
          </IconButton>
          <Button
            sx={{ display: { xs: "none", sm: "block" } }}
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/backoffice" })}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <span />
      )}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <SideBar />
      </Drawer>
    </Box>
  );
};

export default Topbar;
