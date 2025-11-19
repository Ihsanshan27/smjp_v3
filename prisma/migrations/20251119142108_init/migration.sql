/*
  Warnings:

  - The `preferensiRuangJenis` column on the `PenugasanMengajar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[urutan]` on the table `Hari` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `Hari` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jamMulai,jamSelesai]` on the table `SlotWaktu` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `jenis` on the `MataKuliah` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `jenis` on the `Ruang` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JenisRuang" AS ENUM ('TEORI', 'LAB', 'LAINNYA');

-- CreateEnum
CREATE TYPE "JenisMataKuliah" AS ENUM ('WAJIB', 'PILIHAN');

-- AlterTable
ALTER TABLE "MataKuliah" DROP COLUMN "jenis",
ADD COLUMN     "jenis" "JenisMataKuliah" NOT NULL;

-- AlterTable
ALTER TABLE "PenugasanMengajar" DROP COLUMN "preferensiRuangJenis",
ADD COLUMN     "preferensiRuangJenis" "JenisRuang";

-- AlterTable
ALTER TABLE "Ruang" DROP COLUMN "jenis",
ADD COLUMN     "jenis" "JenisRuang" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hari_urutan_key" ON "Hari"("urutan");

-- CreateIndex
CREATE UNIQUE INDEX "Hari_nama_key" ON "Hari"("nama");

-- CreateIndex
CREATE INDEX "JadwalKuliah_batchId_idx" ON "JadwalKuliah"("batchId");

-- CreateIndex
CREATE INDEX "JadwalKuliah_hariId_slotWaktuId_ruangId_idx" ON "JadwalKuliah"("hariId", "slotWaktuId", "ruangId");

-- CreateIndex
CREATE INDEX "PenugasanMengajar_programMatkulId_idx" ON "PenugasanMengajar"("programMatkulId");

-- CreateIndex
CREATE INDEX "PenugasanMengajar_kelompokKelasId_idx" ON "PenugasanMengajar"("kelompokKelasId");

-- CreateIndex
CREATE INDEX "PenugasanMengajar_dosenId_idx" ON "PenugasanMengajar"("dosenId");

-- CreateIndex
CREATE INDEX "ProgramMatkul_prodiId_periodeId_idx" ON "ProgramMatkul"("prodiId", "periodeId");

-- CreateIndex
CREATE UNIQUE INDEX "SlotWaktu_jamMulai_jamSelesai_key" ON "SlotWaktu"("jamMulai", "jamSelesai");
