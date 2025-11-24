/*
  Warnings:

  - You are about to drop the `Pengajuan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PengajuanKendala` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Pengajuan" DROP CONSTRAINT "Pengajuan_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pengajuan" DROP CONSTRAINT "Pengajuan_dibuatOlehId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pengajuan" DROP CONSTRAINT "Pengajuan_disetujuiOlehId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pengajuan" DROP CONSTRAINT "Pengajuan_dosenId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PengajuanKendala" DROP CONSTRAINT "PengajuanKendala_jadwalKuliahId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PengajuanKendala" DROP CONSTRAINT "PengajuanKendala_pengajuanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PengajuanKendala" DROP CONSTRAINT "PengajuanKendala_penugasanMengajarId_fkey";

-- DropTable
DROP TABLE "public"."Pengajuan";

-- DropTable
DROP TABLE "public"."PengajuanKendala";
