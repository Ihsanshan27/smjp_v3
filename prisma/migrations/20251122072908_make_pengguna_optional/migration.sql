-- DropForeignKey
ALTER TABLE "public"."Dosen" DROP CONSTRAINT "Dosen_penggunaId_fkey";

-- AlterTable
ALTER TABLE "Dosen" ALTER COLUMN "penggunaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
