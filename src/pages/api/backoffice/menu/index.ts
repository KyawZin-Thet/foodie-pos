// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, assetUrl, menuCategoryIds } = req.body;
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.create({ data: { name, price, assetUrl } });
    const newMenuCategoryMenu: { menuCategoryId: number; menuId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuCategoryId: item,
        menuId: menu.id,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      newMenuCategoryMenu.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuCategoryId: item.menuCategoryId, menuId: item.menuId },
        })
      )
    );
    return res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    const {
      id,
      name,
      price,
      menuCategoryIds,
      locationId,
      isAvailable,
      assetUrl,
    } = req.body;
    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.menu.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.update({
      data: { name, price, assetUrl },
      where: { id },
    });
    /*  if (exist.assetUrl && exist.assetUrl !== assetUrl) {
      await deleteOldMenuImage(assetUrl);
    } */
    // update menuCategoryMenu table
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });
    const menuCategoryMenusData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenusData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: item,
        })
      )
    );

    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId },
      });
      if (!exist) {
        await prisma.disabledLocationMenu.create({
          data: { locationId, menuId: id },
        });
      }
    } else if (locationId && isAvailable === true) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenu.delete({
          where: { id: exist.id },
        });
      }
    }
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    const allMenuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: location?.companyId },
      })
    ).map((item) => item.id);
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: allMenuCategoryIds } },
      })
    ).map((item) => item.menuId);
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: menuIds } },
    });
    return res
      .status(200)
      .json({ menu, menuCategoryMenus, disabledLocationMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const menu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!menu) return res.status(400).send("Bad request.");
    await prisma.menuAddonCategory.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });
    const menuAddonCategoriesRow = await prisma.menuAddonCategory.findMany({
      where: { menuId },
    });
    const addonCategoryIds = menuAddonCategoriesRow.map(
      (item) => item.addonCategoryId
    );

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method not allowed.");
}
