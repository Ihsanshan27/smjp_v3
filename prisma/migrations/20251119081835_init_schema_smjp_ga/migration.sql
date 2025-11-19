-- CreateEnum
CREATE TYPE "PeranPengguna" AS ENUM ('ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN');

-- CreateEnum
CREATE TYPE "Paruh" AS ENUM ('GANJIL', 'GENAP');

-- CreateEnum
CREATE TYPE "StatusBatch" AS ENUM ('DRAF', 'SIAP', 'FINAL');

-- CreateEnum
CREATE TYPE "StatusPenugasanMengajar" AS ENUM ('DRAF', 'SIAP');

-- CreateEnum
CREATE TYPE "StatusPengajuan" AS ENUM ('DRAF', 'TERKIRIM', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "JenisKendala" AS ENUM ('KAPASITAS_RUANG', 'KETERSEDIAAN_DOSEN', 'TABRAKAN_JADWAL', 'LAINNYA');

-- CreateTable
CREATE TABLE "Fakultas" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Fakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prodi" (
    "id" TEXT NOT NULL,
    "fakultasId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenjang" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengguna" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "peran" "PeranPengguna" NOT NULL,
    "fakultasId" TEXT,
    "prodiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dosen" (
    "id" TEXT NOT NULL,
    "penggunaId" TEXT NOT NULL,
    "nidn" TEXT,
    "bebanMengajarMaks" INTEGER,
    "fakultasId" TEXT,
    "prodiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodeAkademik" (
    "id" TEXT NOT NULL,
    "fakultasId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "paruh" "Paruh" NOT NULL,
    "tahunMulai" INTEGER NOT NULL,
    "tahunSelesai" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PeriodeAkademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hari" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Hari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotWaktu" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jamMulai" TIME(0) NOT NULL,
    "jamSelesai" TIME(0) NOT NULL,
    "durasiMenit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SlotWaktu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruang" (
    "id" TEXT NOT NULL,
    "fakultasId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "lokasi" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Ruang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "sksTeori" INTEGER NOT NULL DEFAULT 0,
    "sksPraktik" INTEGER NOT NULL DEFAULT 0,
    "sksTotal" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kurikulum" (
    "id" TEXT NOT NULL,
    "prodiId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "angkatanMulai" INTEGER NOT NULL,
    "angkatanSelesai" INTEGER,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Kurikulum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KurikulumMatkul" (
    "id" TEXT NOT NULL,
    "kurikulumId" TEXT NOT NULL,
    "mataKuliahId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "minimalSemester" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "KurikulumMatkul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramMatkul" (
    "id" TEXT NOT NULL,
    "prodiId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,
    "mataKuliahId" TEXT NOT NULL,
    "kurikulumId" TEXT,
    "jumlahKelompokKelas" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgramMatkul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelompokKelas" (
    "id" TEXT NOT NULL,
    "prodiId" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "kapasitas" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "KelompokKelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenugasanMengajar" (
    "id" TEXT NOT NULL,
    "programMatkulId" TEXT NOT NULL,
    "kelompokKelasId" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "jumlahSesiPerMinggu" INTEGER NOT NULL,
    "butuhLab" BOOLEAN NOT NULL DEFAULT false,
    "preferensiRuangJenis" TEXT,
    "status" "StatusPenugasanMengajar" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PenugasanMengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferensiDosen" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "hariId" TEXT NOT NULL,
    "slotWaktuId" TEXT NOT NULL,
    "bolehMengajar" BOOLEAN NOT NULL DEFAULT true,
    "prioritas" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PreferensiDosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchJadwal" (
    "id" TEXT NOT NULL,
    "fakultasId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "status" "StatusBatch" NOT NULL DEFAULT 'SIAP',
    "ukuranPopulasi" INTEGER NOT NULL,
    "jumlahGenerasi" INTEGER NOT NULL,
    "fitnessTerbaik" DOUBLE PRECISION,
    "tanggalGenerate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dibuatOlehId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BatchJadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalKuliah" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "penugasanMengajarId" TEXT NOT NULL,
    "hariId" TEXT NOT NULL,
    "slotWaktuId" TEXT NOT NULL,
    "ruangId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "JadwalKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengajuan" (
    "id" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "batchId" TEXT,
    "tipe" TEXT NOT NULL,
    "status" "StatusPengajuan" NOT NULL DEFAULT 'DRAF',
    "alasan" TEXT,
    "dibuatOlehId" TEXT NOT NULL,
    "disetujuiOlehId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pengajuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengajuanKendala" (
    "id" TEXT NOT NULL,
    "pengajuanId" TEXT NOT NULL,
    "jenisKendala" "JenisKendala" NOT NULL,
    "deskripsi" TEXT,
    "penugasanMengajarId" TEXT,
    "jadwalKuliahId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PengajuanKendala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GaKromosom" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "generasi" INTEGER NOT NULL,
    "fitness" DOUBLE PRECISION NOT NULL,
    "isBest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GaKromosom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GaGen" (
    "id" TEXT NOT NULL,
    "kromosomId" TEXT NOT NULL,
    "penugasanMengajarId" TEXT NOT NULL,
    "hariId" TEXT NOT NULL,
    "slotWaktuId" TEXT NOT NULL,
    "ruangId" TEXT NOT NULL,
    "dosenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GaGen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fakultas_kode_key" ON "Fakultas"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_penggunaId_key" ON "Dosen"("penggunaId");

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_nidn_key" ON "Dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "Ruang_fakultasId_kode_key" ON "Ruang"("fakultasId", "kode");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_kode_key" ON "MataKuliah"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Kurikulum_prodiId_nama_key" ON "Kurikulum"("prodiId", "nama");

-- CreateIndex
CREATE UNIQUE INDEX "KurikulumMatkul_kurikulumId_mataKuliahId_key" ON "KurikulumMatkul"("kurikulumId", "mataKuliahId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramMatkul_prodiId_periodeId_mataKuliahId_kurikulumId_key" ON "ProgramMatkul"("prodiId", "periodeId", "mataKuliahId", "kurikulumId");

-- CreateIndex
CREATE UNIQUE INDEX "KelompokKelas_prodiId_kode_angkatan_key" ON "KelompokKelas"("prodiId", "kode", "angkatan");

-- CreateIndex
CREATE UNIQUE INDEX "PreferensiDosen_dosenId_hariId_slotWaktuId_key" ON "PreferensiDosen"("dosenId", "hariId", "slotWaktuId");

-- AddForeignKey
ALTER TABLE "Prodi" ADD CONSTRAINT "Prodi_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengguna" ADD CONSTRAINT "Pengguna_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengguna" ADD CONSTRAINT "Pengguna_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dosen" ADD CONSTRAINT "Dosen_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodeAkademik" ADD CONSTRAINT "PeriodeAkademik_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruang" ADD CONSTRAINT "Ruang_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kurikulum" ADD CONSTRAINT "Kurikulum_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KurikulumMatkul" ADD CONSTRAINT "KurikulumMatkul_kurikulumId_fkey" FOREIGN KEY ("kurikulumId") REFERENCES "Kurikulum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KurikulumMatkul" ADD CONSTRAINT "KurikulumMatkul_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "MataKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramMatkul" ADD CONSTRAINT "ProgramMatkul_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramMatkul" ADD CONSTRAINT "ProgramMatkul_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "PeriodeAkademik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramMatkul" ADD CONSTRAINT "ProgramMatkul_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "MataKuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramMatkul" ADD CONSTRAINT "ProgramMatkul_kurikulumId_fkey" FOREIGN KEY ("kurikulumId") REFERENCES "Kurikulum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelompokKelas" ADD CONSTRAINT "KelompokKelas_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanMengajar" ADD CONSTRAINT "PenugasanMengajar_programMatkulId_fkey" FOREIGN KEY ("programMatkulId") REFERENCES "ProgramMatkul"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanMengajar" ADD CONSTRAINT "PenugasanMengajar_kelompokKelasId_fkey" FOREIGN KEY ("kelompokKelasId") REFERENCES "KelompokKelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanMengajar" ADD CONSTRAINT "PenugasanMengajar_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferensiDosen" ADD CONSTRAINT "PreferensiDosen_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferensiDosen" ADD CONSTRAINT "PreferensiDosen_hariId_fkey" FOREIGN KEY ("hariId") REFERENCES "Hari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferensiDosen" ADD CONSTRAINT "PreferensiDosen_slotWaktuId_fkey" FOREIGN KEY ("slotWaktuId") REFERENCES "SlotWaktu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchJadwal" ADD CONSTRAINT "BatchJadwal_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "Fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchJadwal" ADD CONSTRAINT "BatchJadwal_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "PeriodeAkademik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchJadwal" ADD CONSTRAINT "BatchJadwal_dibuatOlehId_fkey" FOREIGN KEY ("dibuatOlehId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchJadwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_penugasanMengajarId_fkey" FOREIGN KEY ("penugasanMengajarId") REFERENCES "PenugasanMengajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_hariId_fkey" FOREIGN KEY ("hariId") REFERENCES "Hari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_slotWaktuId_fkey" FOREIGN KEY ("slotWaktuId") REFERENCES "SlotWaktu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalKuliah" ADD CONSTRAINT "JadwalKuliah_ruangId_fkey" FOREIGN KEY ("ruangId") REFERENCES "Ruang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengajuan" ADD CONSTRAINT "Pengajuan_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengajuan" ADD CONSTRAINT "Pengajuan_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchJadwal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengajuan" ADD CONSTRAINT "Pengajuan_dibuatOlehId_fkey" FOREIGN KEY ("dibuatOlehId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengajuan" ADD CONSTRAINT "Pengajuan_disetujuiOlehId_fkey" FOREIGN KEY ("disetujuiOlehId") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanKendala" ADD CONSTRAINT "PengajuanKendala_pengajuanId_fkey" FOREIGN KEY ("pengajuanId") REFERENCES "Pengajuan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanKendala" ADD CONSTRAINT "PengajuanKendala_penugasanMengajarId_fkey" FOREIGN KEY ("penugasanMengajarId") REFERENCES "PenugasanMengajar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanKendala" ADD CONSTRAINT "PengajuanKendala_jadwalKuliahId_fkey" FOREIGN KEY ("jadwalKuliahId") REFERENCES "JadwalKuliah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaKromosom" ADD CONSTRAINT "GaKromosom_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchJadwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_kromosomId_fkey" FOREIGN KEY ("kromosomId") REFERENCES "GaKromosom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_penugasanMengajarId_fkey" FOREIGN KEY ("penugasanMengajarId") REFERENCES "PenugasanMengajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_hariId_fkey" FOREIGN KEY ("hariId") REFERENCES "Hari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_slotWaktuId_fkey" FOREIGN KEY ("slotWaktuId") REFERENCES "SlotWaktu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_ruangId_fkey" FOREIGN KEY ("ruangId") REFERENCES "Ruang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GaGen" ADD CONSTRAINT "GaGen_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
