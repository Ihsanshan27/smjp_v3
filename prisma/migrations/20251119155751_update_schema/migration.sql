/*
  Warnings:

  - A unique constraint covering the columns `[nidn,deletedAt]` on the table `Dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kode,deletedAt]` on the table `MataKuliah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kode,deletedAt]` on the table `Prodi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Dosen_nidn_key";

-- DropIndex
DROP INDEX "public"."MataKuliah_kode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_nidn_deletedAt_key" ON "Dosen"("nidn", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_kode_deletedAt_key" ON "MataKuliah"("kode", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Prodi_kode_deletedAt_key" ON "Prodi"("kode", "deletedAt");
