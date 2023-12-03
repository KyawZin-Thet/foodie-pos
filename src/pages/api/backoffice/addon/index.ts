import { prisma } from "@/utils/db";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthoried.");
  if (method === "POST") {
    const { name, price, addonCategoryId } = req.body;
    const isValid = name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("bad request");
    const createdAddon = await prisma.addon.create({
      data: { name, price, addonCategoryId },
    });

    return res.status(200).json({ createdAddon });
  } else if (method === "PUT") {
    const { id, name, price, addonCategoryId } = req.body;
    const isValid = id && name && price !== undefined && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.addon.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.2");
    const updatedAddon = await prisma.addon.update({
      data: { name, price, addonCategoryId },
      where: { id },
    });

    return res.status(200).json({ updatedAddon });
  } else if (method === "DELETE") {
    const addonId = Number(req.query.id);
    if (!addonId) return res.status(400).send("Bad request.1");
    const exist = await prisma.addon.findFirst({ where: { id: addonId } });
    if (!exist) return res.status(400).send("Bad request.2");

    await prisma.addon.update({
      data: { isArchived: true },
      where: { id: addonId },
    });

    return res.status(200).send("Deleted.");
  } else {
    res.status(405).send("method not allwoed");
  }
}
