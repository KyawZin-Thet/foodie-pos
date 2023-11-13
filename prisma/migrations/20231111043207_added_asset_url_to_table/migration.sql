/*
  Warnings:

  - You are about to drop the column `comapnyId` on the `MenuCategory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MenuCategoryMenu` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `MenuCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetUrl` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuCategory" DROP CONSTRAINT "MenuCategory_comapnyId_fkey";

-- AlterTable
ALTER TABLE "MenuCategory" DROP COLUMN "comapnyId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MenuCategoryMenu" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "assetUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
