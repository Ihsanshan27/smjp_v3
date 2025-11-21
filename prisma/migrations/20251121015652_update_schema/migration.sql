/*
  Warnings:

  - You are about to drop the column `sksPraktik` on the `MataKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `sksTeori` on the `MataKuliah` table. All the data in the column will be lost.
  - You are about to drop the column `sksTotal` on the `MataKuliah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MataKuliah" DROP COLUMN "sksPraktik",
DROP COLUMN "sksTeori",
DROP COLUMN "sksTotal",
ADD COLUMN     "sks" INTEGER NOT NULL DEFAULT 0;
