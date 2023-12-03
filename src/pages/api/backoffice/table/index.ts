// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized.");
  if (method === "POST") {
    const { locationId, name } = req.body;
    const user = session.user;
    const email = user?.email as string;
    const dbUser = await prisma.user.findUnique({ where: { email } });

    const isValid = locationId && name && dbUser;
    if (!isValid) res.status(400).send("Bad request.");

    const table = await prisma.table.create({
      data: { name, locationId, assetUrl: "" },
    });
    const companyId = dbUser?.companyId as number;
    const tableId = table.id;

    await qrCodeImageUpload(tableId);
    const assetUrl = getQrCodeUrl(tableId);

    const createdTable = await prisma.table.update({
      data: { assetUrl },
      where: { id: tableId },
    });

    return res.status(200).json({ createdTable });
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.table.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
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
