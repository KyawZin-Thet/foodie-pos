// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { locationId, newMenuCategory } = req.body;
    const isValid = locationId && newMenuCategory;
    if (!isValid) res.status(400).send("Bad request.1");
    const currentLocation = await prisma.location.findFirst({
      where: { id: locationId },
    });

    if (!currentLocation) return res.status(400).send("Bad request.2");

    const createdMenuCategory = await prisma.menuCategory.create({
      data: { name: newMenuCategory, companyId: currentLocation.companyId },
    });

    return res.status(200).json({ createdMenuCategory });
  } else if (method === "PUT") {
    const { id, newMenuCategoryname: name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.menuCategory.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.2");
    const updatedMenuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });

    return res.status(200).json({ updatedMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    if (!menuCategoryId) return res.status(400).send("Bad request.1");
    const exist = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });
    if (!exist) return res.status(400).send("Bad request.2");

    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });

    return res.status(200).send("Deleted.");
  } else {
    res.status(405).send("method not allwoed");
  }
}
