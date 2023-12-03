// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CartItem } from "@/types/cart";
import { prisma } from "@/utils/db";
import { getCartTotalPrice } from "@/utils/generals";
import { ORDERSTATUS } from "@prisma/client";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const isValid = req.query.orderSeq;
    if (!isValid) return res.status(400).send("Bad request");
    const orderSeq = String(req.query.orderSeq);
    const exist = await prisma.order.findMany({ where: { orderSeq } });
    if (!exist) return res.status(400).send("Bad request");
    return res.status(200).json({ orders: exist });
  } else if (method === "POST") {
    const { tableId, cartItems } = req.body;
    const isValid = tableId && cartItems.length;
    if (!isValid) return res.status(400).send("Bad request.");
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { in: [ORDERSTATUS.PENDING, ORDERSTATUS.COOKING] },
      },
    });
    const orderSeq = order ? order.orderSeq : nanoid();
    const totalPrice = order
      ? order.totalPrice + getCartTotalPrice(cartItems)
      : getCartTotalPrice(cartItems);
    for (const item of cartItems) {
      const cartItem = item as CartItem;
      const hasAddons = cartItem.addons.length > 0;
      if (hasAddons) {
        for (const addon of cartItem.addons) {
          await prisma.order.create({
            data: {
              menuId: cartItem.menu.id,
              addonId: addon.id,
              quantity: cartItem.quantity,
              orderSeq,
              itemId: cartItem.id,
              status: ORDERSTATUS.PENDING,
              totalPrice,
              tableId,
            },
          });
        }
      } else {
        await prisma.order.create({
          data: {
            menuId: cartItem.menu.id,
            quantity: cartItem.quantity,
            orderSeq,
            itemId: cartItem.id,
            status: ORDERSTATUS.PENDING,
            totalPrice,
            tableId,
          },
        });
      }
    }
    await prisma.order.updateMany({
      data: { totalPrice },
      where: { orderSeq },
    });
    const orders = await prisma.order.findMany({ where: { orderSeq } });
    return res.status(200).json({ orders });
  } else if (method === "PUT") {
    const itemId = String(req.query.itemId);
    const isValid = itemId && req.body.status;
    if (!isValid) return res.status(400).send("Bad request");
    const exist = await prisma.order.findFirst({ where: { itemId } });
    if (!exist) return res.status(400).send("Bad request");
    await prisma.order.updateMany({
      data: { status: req.body.status as ORDERSTATUS },
      where: { itemId },
    });
    const table = await prisma.table.findFirst({
      where: { id: exist.tableId },
    });
    const tableIds = (
      await prisma.table.findMany({ where: { locationId: table?.locationId } })
    ).map((item) => item.id);
    const orders = await prisma.order.findMany({
      where: { tableId: { in: tableIds }, isArchived: false },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ orders });
  }
  res.status(405).send("Method not allowed.");
}
