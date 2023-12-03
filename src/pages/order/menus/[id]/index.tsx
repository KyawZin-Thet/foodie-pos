import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hook";

import { addToCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { Box, Button } from "@mui/material";
import { Addon } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const { query, isReady, ...router } = useRouter();
  const menuId = Number(query.id);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemId = String(query.cartItemId);
  const cartItem = cartItems.find((item) => item.id === cartItemId);
  const menus = useAppSelector((state) => state.menu.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menu = menus.find((item) => item.id === menuId);
  const [quantity, setQuantity] = useState(1);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const dispatch = useAppDispatch();
  const allMenuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const addonCategoryIds = allMenuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((item) => item.addonCategoryId);
  const addonCategories = useAppSelector(
    (state) => state.addonCategory.items
  ).filter((item) => addonCategoryIds.includes(item.id));

  useEffect(() => {
    const requiredAddonCategories = addonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequired = selectedAddons.filter((selectedAddon) => {
      const addon = addons.find((item) => item.id === selectedAddon.id);
      const addonCategory = addonCategories.find(
        (item) => item.id === addon?.addonCategoryId && item.isRequired
      );
      return addonCategory ? true : false;
    });
    const isDisabled =
      requiredAddonCategories.length !== selectedRequired.length;
    setIsDisabled(isDisabled);
  }, [selectedAddons, addonCategories]);

  useEffect(() => {
    if (cartItemId) {
      const cartItem = cartItems.find((item) => item.id === cartItemId);
      if (cartItem) {
        const { addons, quantity } = cartItem;
        setSelectedAddons(addons);
        setQuantity(quantity);
      }
    }
  }, [cartItemId]);

  const handleQuantityDecrease = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };

  const handleQuantityIncrease = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    if (!menu) return;
    const cartItem: CartItem = {
      id: cartItemId ? cartItemId : nanoid(),
      menu,
      quantity,
      addons: selectedAddons,
    };
    dispatch(addToCart(cartItem));
    const pathname = cartItemId ? "/order/cart" : "/order";
    router.push({ pathname, query });
  };

  if (!isReady || !menu) return null;

  return (
    <Box sx={{ position: "relative", zIndex: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Image
          src={menu.assetUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddonCategories
            addonCategories={addonCategories}
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
          />
          <QuantitySelector
            value={quantity}
            onDecrease={handleQuantityDecrease}
            onIncrease={handleQuantityIncrease}
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleAddToCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            {cartItem ? "Update" : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuDetail;
