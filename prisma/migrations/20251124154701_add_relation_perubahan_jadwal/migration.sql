-- CreateEnum
CREATE TYPE "StatusPerubahanJadwal" AS ENUM ('DIAJUKAN', 'DISETUJUI', 'DITOLAK');

-- CreateTable
CREATE TABLE "PengajuanPerubahanJadwal" (
    "id" TEXT NOT NULL,
    "jadwalKuliahId" TEXT NOT NULL,
    "hariLamaId" TEXT NOT NULL,
    "slotWaktuLamaId" TEXT NOT NULL,
    "ruangLamaId" TEXT,
    "hariBaruId" TEXT NOT NULL,
    "slotWaktuBaruId" TEXT NOT NULL,
    "ruangBaruId" TEXT,
    "prodiId" TEXT NOT NULL,
    "alasanPengaju" TEXT NOT NULL,
    "alasanRespon" TEXT,
    "status" "StatusPerubahanJadwal" NOT NULL DEFAULT 'DIAJUKAN',
    "diajukanOlehId" TEXT NOT NULL,
    "diprosesOlehId" TEXT,
    "diprosesPada" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "penggunaId" TEXT,

    CONSTRAINT "PengajuanPerubahanJadwal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PengajuanPerubahanJadwal" ADD CONSTRAINT "PengajuanPerubahanJadwal_jadwalKuliahId_fkey" FOREIGN KEY ("jadwalKuliahId") REFERENCES "JadwalKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanPerubahanJadwal" ADD CONSTRAINT "PengajuanPerubahanJadwal_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanPerubahanJadwal" ADD CONSTRAINT "PengajuanPerubahanJadwal_diajukanOlehId_fkey" FOREIGN KEY ("diajukanOlehId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanPerubahanJadwal" ADD CONSTRAINT "PengajuanPerubahanJadwal_diprosesOlehId_fkey" FOREIGN KEY ("diprosesOlehId") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanPerubahanJadwal" ADD CONSTRAINT "PengajuanPerubahanJadwal_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
