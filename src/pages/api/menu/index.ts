import { prisma } from "@/utils/db";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthoried.");

  //create Menu

  if (method === "POST") {
    const { name, price, menuCategoryIds } = req.body;
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("bad request");
    const createdMenu = await prisma.menu.create({ data: { name, price } });
    const newMenuCategoryMenu: { menuCategoryId: number; menuId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuCategoryId: item,
        menuId: createdMenu.id,
      }));

    const menuCategoryMenus = await prisma.$transaction(
      newMenuCategoryMenu.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuCategoryId: item.menuCategoryId, menuId: item.menuId },
        })
      )
    );

    return res.status(200).json({ menuCategoryMenus, createdMenu });
  } else if (method === "PUT") {
    const { id, name, price, menuCategoryIds } = req.body;
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.menu.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.2");
    const menu = await prisma.menu.update({
      data: { name, price },
      where: { id },
    });

    // create updated data
    const menuCategoryMenusData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));

    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });

    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: item.menuId, menuCategoryId: item.menuCategoryId },
        })
      )
    );

    return res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    if (!menuId) return res.status(400).send("Bad request.1");
    const targetMenu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!targetMenu) return res.status(400).send("Bad request.2");

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });

    return res.status(200).send("Deleted.");
  } else {
    res.status(405).send("method not allwoed");
  }
}
