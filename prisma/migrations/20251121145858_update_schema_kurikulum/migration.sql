/*
  Warnings:

  - A unique constraint covering the columns `[prodiId,nama,deletedAt]` on the table `Kurikulum` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Kurikulum_prodiId_nama_key";

-- CreateIndex
CREATE UNIQUE INDEX "Kurikulum_prodiId_nama_deletedAt_key" ON "Kurikulum"("prodiId", "nama", "deletedAt");
