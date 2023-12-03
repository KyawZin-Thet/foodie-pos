import { useAppSelector } from "@/store/hook";
import { OrderItem } from "@/types/order";
import { Box, Card, MenuItem, Select, Typography } from "@mui/material";
import { AddonCategory, ORDERSTATUS } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  isAdmin: boolean;
  handleOrderStatuUpdate?: (itemId: string, status: ORDERSTATUS) => void;
}

const OrderCard = ({ orderItem, isAdmin, handleOrderStatuUpdate }: Props) => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  if (!orderItem) return null;
  return (
    <Card sx={{ width: 280, height: 280, m: 2 }}>
      <Box
        sx={{
          height: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#E8F6EF",
          backgroundColor: "#4C4C6D",
          px: 2,
        }}
      >
        <Typography>{orderItem.menu.name}</Typography>
        <Typography>{orderItem.table.name}</Typography>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid lightgray",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Item Id: </Typography>
          <Typography>{orderItem.itemId}</Typography>
        </Box>
        <Box sx={{ height: 250 * 0.6, overflow: "scroll" }}>
          {orderItem.orderAddons.map((orderAddon) => {
            const addonCategory = addonCategories.find(
              (item) => item.id === orderAddon.addonCategoryId
            ) as AddonCategory;
            return (
              <Box key={addonCategory.id} sx={{ mb: 2 }}>
                <Typography>{addonCategory.name}</Typography>
                {orderAddon.addons.map((addon) => {
                  return (
                    <Typography
                      key={addon.id}
                      sx={{
                        fontSize: 14,
                        ml: 2,
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      {addon.name}
                    </Typography>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid lightgray",
            pt: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Status: </Typography>
          {isAdmin ? (
            <>
              <Select
                value={orderItem.status}
                onChange={(evt) =>
                  handleOrderStatuUpdate &&
                  handleOrderStatuUpdate(
                    orderItem.itemId,
                    evt.target.value as ORDERSTATUS
                  )
                }
                sx={{ height: 30 }}
              >
                <MenuItem value={ORDERSTATUS.PENDING}>
                  {ORDERSTATUS.PENDING}
                </MenuItem>
                <MenuItem value={ORDERSTATUS.COOKING}>
                  {ORDERSTATUS.COOKING}
                </MenuItem>
                <MenuItem value={ORDERSTATUS.COMPLETE}>
                  {ORDERSTATUS.COMPLETE}
                </MenuItem>
              </Select>
            </>
          ) : (
            <Typography>{orderItem.status}</Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default OrderCard;
