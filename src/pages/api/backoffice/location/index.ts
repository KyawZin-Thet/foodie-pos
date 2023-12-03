// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, street, township, city, companyId } = req.body;
    // data validation
    const isValid = name && street && township && city && companyId;
    if (!isValid) return res.status(400).send("Bad request.");
    const createdLocation = await prisma.location.create({
      data: { name, street, township, city, companyId },
    });
    return res.status(200).json(createdLocation);
  }
  res.status(405).send("Method now allowed.");
}
