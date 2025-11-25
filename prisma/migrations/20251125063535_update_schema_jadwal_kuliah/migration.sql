-- DropForeignKey
ALTER TABLE "public"."JadwalKuliah" DROP CONSTRAINT "JadwalKuliah_ruangId_fkey";

-- AlterTable
ALTER TABLE "JadwalKuliah" ALTER COLUMN "ruangId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_ruangId_fkey" FOREIGN KEY ("ruangId") REFERENCES "Ruang"("id") ON DELETE SET NULL ON UPDATE CASCADE;
