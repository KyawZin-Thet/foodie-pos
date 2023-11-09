// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
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
  if (method === "POST") {
    const { menuIds, isRequired, name } = req.body;
    //data validation
    const isValid = menuIds && name && isRequired !== undefined;
    if (!isValid) res.status(400).send("Bad request.");
    const addonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });

    const newMenuAddonCategory: { menuId: number; addonCategoryId: number }[] =
      menuIds.map((item: number) => ({
        menuId: item,
        addonCategoryId: addonCategory.id,
      }));
    const menuAddonCategories = await prisma.$transaction(
      newMenuAddonCategory.map((item) =>
        prisma.menuAddonCategory.create({
          data: { menuId: item.menuId, addonCategoryId: item.addonCategoryId },
        })
      )
    );

    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "PUT") {
    const { menuIds, isRequired, name, id } = req.body;
    //data validation
    const isValid = menuIds && name && id && isRequired !== undefined;
    if (!isValid) res.status(400).send("Bad request.");
    const updatedAddonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });

    //delete old row
    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });

    // create join data
    const menuAddonCategoryData: { addonCategoryId: number; menuId: number }[] =
      menuIds.map((item: number) => ({ addonCategoryId: id, menuId: item }));

    //create new row
    const menuAddonCategories = await prisma.$transaction(
      menuAddonCategoryData.map((item) =>
        prisma.menuAddonCategory.create({
          data: { addonCategoryId: item.addonCategoryId, menuId: item.menuId },
        })
      )
    );

    return res.status(200).json({ updatedAddonCategory, menuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);
    if (!addonCategoryId) return res.status(400).send("Bad request.1");
    const targetAddonCategory = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });
    if (!targetAddonCategory) return res.status(400).send("Bad request.2");

    await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });

    return res.status(200).send("Deleted.");
  } else {
    res.status(405).send("Method now allowed.");
  }
}
