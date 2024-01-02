// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    // Data validation
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request.");
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("Bad request.");
    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId: location.companyId },
    });
    return res.status(200).json(menuCategory);
  } else if (method === "PUT") {
    const { id, name, locationId, isAvailable } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.menuCategory.findFirst({
      where: { id },
    });
    if (!exist) return res.status(400).send("Bad request.");
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    const menuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });

    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, LocationId: locationId },
      });
      if (!exist) {
        await prisma.disabledLocationMenuCategory.create({
          data: { LocationId: locationId, menuCategoryId: id },
        });
      }
    } else if (locationId && isAvailable === true) {
      console.log("d htel win yae lrrr #######");

      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, LocationId: locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenuCategory.delete({
          where: { id: exist.id },
        });
      }
    }
    const menuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: location?.companyId },
      })
    ).map((item) => item.id);
    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: menuCategoryIds } },
      });
    return res.status(200).json({ menuCategory, disabledLocationMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId, isArchived: false },
      })
    ).map((item) => item.menuId);
    const menuIdsPromise = menuIds.map(async (menuId) => {
      const menuData = { menuId, count: 1 };
      const count = await prisma.menuCategoryMenu.count({
        where: { menuId, isArchived: false },
      });
      menuData.count = count;
      return menuData;
    });
    const menuIdsToArchive = (await Promise.all(menuIdsPromise))
      .filter((item) => item.count === 1)
      .map((item) => item.menuId);

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIdsToArchive }, isArchived: false },
      })
    ).map((item) => item.addonCategoryId);

    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const addonCategoryMenuIds = (
          await prisma.menuAddonCategory.findMany({
            where: {
              addonCategoryId,
              isArchived: false,
            },
          })
        ).map((item) => item.menuId);
        return addonCategoryMenuIds.every((item) =>
          menuIdsToArchive.includes(item)
        )
          ? addonCategoryId
          : undefined;
      }
    );

    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    ).filter((item) => item !== undefined);

    for (const menuId of menuIdsToArchive) {
      await prisma.menu.updateMany({
        data: { isArchived: true },
        where: { id: menuId },
      });
      await prisma.menuAddonCategory.updateMany({
        data: { isArchived: true },
        where: { menuId },
      });
    }
    for (const addonCategoryId of addonCategoryIdsToArchive) {
      await prisma.addonCategory.updateMany({
        data: { isArchived: true },
        where: { id: addonCategoryId },
      });
      await prisma.addon.updateMany({
        data: { isArchived: true },
        where: { addonCategoryId },
      });
    }
    for (const menuId of menuIds) {
      await prisma.menuCategoryMenu.updateMany({
        data: { isArchived: true },
        where: { menuId, menuCategoryId },
      });
    }
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method now allowed.");
}
