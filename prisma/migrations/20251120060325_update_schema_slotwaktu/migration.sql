/*
  Warnings:

  - A unique constraint covering the columns `[jamMulai,jamSelesai,deletedAt]` on the table `SlotWaktu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."SlotWaktu_jamMulai_jamSelesai_key";

-- CreateIndex
CREATE UNIQUE INDEX "SlotWaktu_jamMulai_jamSelesai_deletedAt_key" ON "SlotWaktu"("jamMulai", "jamSelesai", "deletedAt");
