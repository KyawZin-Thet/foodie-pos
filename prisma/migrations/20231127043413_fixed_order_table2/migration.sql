/*
  Warnings:

  - The values [ORDERED,OUTFORDELIVERY,DELIVERED,CANCELLED] on the enum `ORDERSTATUS` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `itemId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ORDERSTATUS_new" AS ENUM ('PENDING', 'COOKING', 'COMPLETE');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "ORDERSTATUS_new" USING ("status"::text::"ORDERSTATUS_new");
ALTER TYPE "ORDERSTATUS" RENAME TO "ORDERSTATUS_old";
ALTER TYPE "ORDERSTATUS_new" RENAME TO "ORDERSTATUS";
DROP TYPE "ORDERSTATUS_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "itemId" TEXT NOT NULL;
