/*
  Warnings:

  - A unique constraint covering the columns `[prodiId,kode,angkatan,deletedAt]` on the table `KelompokKelas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kurikulumId,mataKuliahId,deletedAt]` on the table `KurikulumMatkul` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programMatkulId,kelompokKelasId,dosenId,deletedAt]` on the table `PenugasanMengajar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fakultasId,nama,deletedAt]` on the table `PeriodeAkademik` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dosenId,hariId,slotWaktuId,deletedAt]` on the table `PreferensiDosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prodiId,periodeId,mataKuliahId,kurikulumId,deletedAt]` on the table `ProgramMatkul` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fakultasId,kode,deletedAt]` on the table `Ruang` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."KelompokKelas_prodiId_kode_angkatan_key";

-- DropIndex
DROP INDEX "public"."KurikulumMatkul_kurikulumId_mataKuliahId_key";

-- DropIndex
DROP INDEX "public"."PreferensiDosen_dosenId_hariId_slotWaktuId_key";

-- DropIndex
DROP INDEX "public"."ProgramMatkul_prodiId_periodeId_mataKuliahId_kurikulumId_key";

-- DropIndex
DROP INDEX "public"."Ruang_fakultasId_kode_key";

-- CreateIndex
CREATE UNIQUE INDEX "KelompokKelas_prodiId_kode_angkatan_deletedAt_key" ON "KelompokKelas"("prodiId", "kode", "angkatan", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KurikulumMatkul_kurikulumId_mataKuliahId_deletedAt_key" ON "KurikulumMatkul"("kurikulumId", "mataKuliahId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PenugasanMengajar_programMatkulId_kelompokKelasId_dosenId_d_key" ON "PenugasanMengajar"("programMatkulId", "kelompokKelasId", "dosenId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodeAkademik_fakultasId_nama_deletedAt_key" ON "PeriodeAkademik"("fakultasId", "nama", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PreferensiDosen_dosenId_hariId_slotWaktuId_deletedAt_key" ON "PreferensiDosen"("dosenId", "hariId", "slotWaktuId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramMatkul_prodiId_periodeId_mataKuliahId_kurikulumId_de_key" ON "ProgramMatkul"("prodiId", "periodeId", "mataKuliahId", "kurikulumId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Ruang_fakultasId_kode_deletedAt_key" ON "Ruang"("fakultasId", "kode", "deletedAt");
