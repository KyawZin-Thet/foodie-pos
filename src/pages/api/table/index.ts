// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { locationId, name } = req.body;
    const isValid = locationId && name;
    if (!isValid) res.status(400).send("Bad request.1");

    const createdTable = await prisma.table.create({
      data: { name, locationId },
    });

    return res.status(200).json({ createdTable });
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.table.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.2");
    const updatedTable = await prisma.table.update({
      data: { name },
      where: { id },
    });

    return res.status(200).json({ updatedTable });
  } else if (method === "DELETE") {
    const TableId = Number(req.query.id);
    if (!TableId) return res.status(400).send("Bad request.1");
    const exist = await prisma.table.findFirst({
      where: { id: TableId },
    });
    if (!exist) return res.status(400).send("Bad request.2");

    await prisma.table.update({
      data: { isArchived: true },
      where: { id: TableId },
    });

    return res.status(200).send("Deleted.");
  } else {
    res.status(405).send("method not allwoed");
  }
}
