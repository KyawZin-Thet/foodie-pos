import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../assets/logo.png";

const Topbar = () => {
  const { data } = useSession();
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
        <Image
          src={logo}
          alt="logo"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
      <Typography variant="h5" color={"secondary"}>
        Foodie POS
      </Typography>
      {data ? (
        <Box>
          <Button
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <span />
      )}
    </Box>
  );
};

export default Topbar;
