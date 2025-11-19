/*
  Warnings:

  - A unique constraint covering the columns `[kode,deletedAt]` on the table `Fakultas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Fakultas_kode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Fakultas_kode_deletedAt_key" ON "Fakultas"("kode", "deletedAt");
