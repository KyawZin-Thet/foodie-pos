import { useAppDispatch, useAppSelector } from "@/store/hook";
import { CartState } from "@/store/slices/cartSlice";
import { createNewLocation } from "@/store/slices/locationSlice";
import { AddonSlice } from "@/types/addon";
import { AddonCategorySlice } from "@/types/addonCategory";
import { AppSlice } from "@/types/app";
import { CompanySlice } from "@/types/company";
import { DisabledLocationMenuSlice } from "@/types/disabledLocationMenu";
import { DisabledLocationMenuCategorySlice } from "@/types/disabledLocationMenuCategory";
import { LocationSlice } from "@/types/location";
import { MenuSlice } from "@/types/menu";
import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { MenuCategorySlice } from "@/types/menuCategory";
import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { SnackBarSlice } from "@/types/mySnackBar";
import { OrderSlice } from "@/types/order";
import { TableSlice } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface StateType {
  app: AppSlice;
  location: LocationSlice;
  menuCategory: MenuCategorySlice;
  menu: MenuSlice;
  menuCategoryMenu: MenuCategoryMenuSlice;
  addonCategory: AddonCategorySlice;
  menuAddonCategory: MenuAddonCategorySlice;
  addon: AddonSlice;
  table: TableSlice;
  snackBar: SnackBarSlice;
  disabledLocationMenuCategory: DisabledLocationMenuCategorySlice;
  disabledLocationMenu: DisabledLocationMenuSlice;
  cart: CartState;
  order: OrderSlice;
  company: CompanySlice;
}

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewLocation = ({ open, setOpen }: Props) => {
  const companyId = useAppSelector(
    (state: StateType) => state.company.item?.id
  );

  const [newLocation, setNewLocation] = useState({
    name: "",
    street: "",
    township: "",
    city: "",
  });
  const dispatch = useAppDispatch();

  if (!companyId) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create new location</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="Name"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            placeholder="Street"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, street: evt.target.value })
            }
          />
          <TextField
            placeholder="Township"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, township: evt.target.value })
            }
          />
          <TextField
            placeholder="City"
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, city: evt.target.value })
            }
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{ width: "fit-content", mr: 2 }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={
                newLocation.name &&
                newLocation.street &&
                newLocation.township &&
                newLocation.city
                  ? false
                  : true
              }
              variant="contained"
              sx={{ width: "fit-content" }}
              onClick={() => {
                dispatch(
                  createNewLocation({
                    ...newLocation,
                    companyId,
                    onSuccess: () => setOpen(false),
                  })
                );
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
