// prisma/seed.js
const { PrismaClient, PeranPengguna, Paruh, StatusPenugasanMengajar } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// helper buat time (Postgres TIME)
function timeToDate(timeStr) {
    return new Date(`1970-01-01T${timeStr}:00.000Z`);
}

async function main() {
    console.log('🌱 Start seeding...');

    /**
     * 1. HARI (Senin–Sabtu)
     */
    const hariNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    for (let i = 0; i < hariNames.length; i++) {
        await prisma.hari.upsert({
            where: { id: `seed-hari-${i + 1}` },
            update: {
                nama: hariNames[i],
                urutan: i + 1,
                deletedAt: null,
            },
            create: {
                id: `seed-hari-${i + 1}`,
                nama: hariNames[i],
                urutan: i + 1,
            },
        });
    }

    console.log('✅ Seed Hari selesai');

    /**
     * 2. SLOT WAKTU (6 sesi contoh)
     */
    const slotData = [
        { nama: 'Sesi 1', mulai: '07:30', selesai: '09:10' },
        { nama: 'Sesi 2', mulai: '09:20', selesai: '11:00' },
        { nama: 'Sesi 3', mulai: '11:10', selesai: '12:50' },
        { nama: 'Sesi 4', mulai: '13:30', selesai: '15:10' },
        { nama: 'Sesi 5', mulai: '15:20', selesai: '17:00' },
        { nama: 'Sesi 6', mulai: '17:10', selesai: '18:50' },
    ];

    for (let i = 0; i < slotData.length; i++) {
        const s = slotData[i];
        const mulai = timeToDate(s.mulai);
        const selesai = timeToDate(s.selesai);
        const durasi = Math.round((selesai - mulai) / (1000 * 60));

        await prisma.slotWaktu.upsert({
            where: { id: `seed-slot-${i + 1}` },
            update: {
                nama: s.nama,
                jamMulai: mulai,
                jamSelesai: selesai,
                durasiMenit: durasi,
                deletedAt: null,
            },
            create: {
                id: `seed-slot-${i + 1}`,
                nama: s.nama,
                jamMulai: mulai,
                jamSelesai: selesai,
                durasiMenit: durasi,
            },
        });
    }

    console.log('✅ Seed SlotWaktu selesai');

    /**
     * 3. FAKULTAS
     */
    const fakultasFTS = await prisma.fakultas.upsert({
        where: { kode: 'FTS' },
        update: {
            nama: 'Fakultas Teknik dan Sains',
            deletedAt: null,
        },
        create: {
            kode: 'FTS',
            nama: 'Fakultas Teknik dan Sains',
        },
    });

    console.log('✅ Seed Fakultas selesai');

    /**
     * 4. PRODI (contoh: TI & SI)
     * NOTE: Karena di schema Prodi tidak punya @unique kode saja,
     * kita perlu buat dulu atau pakai createMany dengan skipDuplicates
     */
    try {
        const prodiTI = await prisma.prodi.create({
            data: {
                kode: 'TI',
                nama: 'Teknik Informatika',
                jenjang: 'S1',
                fakultasId: fakultasFTS.id,
            }
        });
        console.log('✅ Prodi TI created');
    } catch (error) {
        console.log('ℹ️ Prodi TI sudah ada, mencari yang existing...');
    }

    try {
        const prodiSI = await prisma.prodi.create({
            data: {
                kode: 'SI',
                nama: 'Sistem Informasi',
                jenjang: 'S1',
                fakultasId: fakultasFTS.id,
            }
        });
        console.log('✅ Prodi SI created');
    } catch (error) {
        console.log('ℹ️ Prodi SI sudah ada, mencari yang existing...');
    }

    // Ambil prodi yang sudah ada
    const prodiTI = await prisma.prodi.findFirst({
        where: { kode: 'TI', fakultasId: fakultasFTS.id }
    });

    const prodiSI = await prisma.prodi.findFirst({
        where: { kode: 'SI', fakultasId: fakultasFTS.id }
    });

    console.log('✅ Seed Prodi selesai');

    /**
     * 5. RUANG - menggunakan composite unique key
     */
    await prisma.ruang.upsert({
        where: {
            fakultasId_kode: {
                fakultasId: fakultasFTS.id,
                kode: 'KELAS-101'
            }
        },
        update: {
            nama: 'Ruang Kelas 101',
            kapasitas: 40,
            jenis: 'TEORI',
            aktif: true,
            deletedAt: null,
        },
        create: {
            kode: 'KELAS-101',
            nama: 'Ruang Kelas 101',
            kapasitas: 40,
            jenis: 'TEORI',
            aktif: true,
            fakultasId: fakultasFTS.id,
        },
    });

    await prisma.ruang.upsert({
        where: {
            fakultasId_kode: {
                fakultasId: fakultasFTS.id,
                kode: 'LAB-1'
            }
        },
        update: {
            nama: 'Laboratorium 1',
            kapasitas: 30,
            jenis: 'LAB',
            aktif: true,
            deletedAt: null,
        },
        create: {
            kode: 'LAB-1',
            nama: 'Laboratorium 1',
            kapasitas: 30,
            jenis: 'LAB',
            aktif: true,
            fakultasId: fakultasFTS.id,
        },
    });

    console.log('✅ Seed Ruang selesai');

    /**
     * 6. PERIODE AKADEMIK
     */
    const periodeGanjil = await prisma.periodeAkademik.upsert({
        where: { id: 'seed-periode-2025-ganjil' },
        update: {
            nama: '2025/2026 Ganjil',
            paruh: Paruh.GANJIL,
            tahunMulai: 2025,
            tahunSelesai: 2026,
            tanggalMulai: new Date('2025-08-01T00:00:00.000Z'),
            tanggalSelesai: new Date('2026-01-31T00:00:00.000Z'),
            aktif: true,
            fakultasId: fakultasFTS.id,
            deletedAt: null,
        },
        create: {
            id: 'seed-periode-2025-ganjil',
            nama: '2025/2026 Ganjil',
            paruh: Paruh.GANJIL,
            tahunMulai: 2025,
            tahunSelesai: 2026,
            tanggalMulai: new Date('2025-08-01T00:00:00.000Z'),
            tanggalSelesai: new Date('2026-01-31T00:00:00.000Z'),
            aktif: true,
            fakultasId: fakultasFTS.id,
        },
    });

    console.log('✅ Seed PeriodeAkademik selesai');

    /**
     * 7. MATA KULIAH
     */
    const mkAlgo = await prisma.mataKuliah.upsert({
        where: { kode: 'IF201' },
        update: {
            nama: 'Algoritma dan Pemrograman',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
            deletedAt: null,
        },
        create: {
            kode: 'IF201',
            nama: 'Algoritma dan Pemrograman',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
        },
    });

    const mkBD = await prisma.mataKuliah.upsert({
        where: { kode: 'IF301' },
        update: {
            nama: 'Basis Data',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
            deletedAt: null,
        },
        create: {
            kode: 'IF301',
            nama: 'Basis Data',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
        },
    });

    const mkJarkom = await prisma.mataKuliah.upsert({
        where: { kode: 'IF401' },
        update: {
            nama: 'Jaringan Komputer',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
            deletedAt: null,
        },
        create: {
            kode: 'IF401',
            nama: 'Jaringan Komputer',
            sksTeori: 2,
            sksPraktik: 1,
            sksTotal: 3,
            jenis: 'WAJIB',
        },
    });

    console.log('✅ Seed MataKuliah selesai');

    /**
     * 8. KURIKULUM & KURIKULUM_MATKUL - menggunakan composite unique key
     */
    const kurTI2020 = await prisma.kurikulum.upsert({
        where: {
            prodiId_nama: {
                prodiId: prodiTI.id,
                nama: 'Kurikulum 2020'
            }
        },
        update: {
            angkatanMulai: 2020,
            angkatanSelesai: null,
            aktif: true,
            deletedAt: null,
        },
        create: {
            prodiId: prodiTI.id,
            nama: 'Kurikulum 2020',
            angkatanMulai: 2020,
            angkatanSelesai: null,
            aktif: true,
        },
    });

    await prisma.kurikulumMatkul.upsert({
        where: {
            kurikulumId_mataKuliahId: {
                kurikulumId: kurTI2020.id,
                mataKuliahId: mkAlgo.id
            }
        },
        update: {
            semester: 2,
            minimalSemester: 2,
            deletedAt: null,
        },
        create: {
            kurikulumId: kurTI2020.id,
            mataKuliahId: mkAlgo.id,
            semester: 2,
            minimalSemester: 2,
        },
    });

    await prisma.kurikulumMatkul.upsert({
        where: {
            kurikulumId_mataKuliahId: {
                kurikulumId: kurTI2020.id,
                mataKuliahId: mkBD.id
            }
        },
        update: {
            semester: 3,
            minimalSemester: 3,
            deletedAt: null,
        },
        create: {
            kurikulumId: kurTI2020.id,
            mataKuliahId: mkBD.id,
            semester: 3,
            minimalSemester: 3,
        },
    });

    await prisma.kurikulumMatkul.upsert({
        where: {
            kurikulumId_mataKuliahId: {
                kurikulumId: kurTI2020.id,
                mataKuliahId: mkJarkom.id
            }
        },
        update: {
            semester: 4,
            minimalSemester: 4,
            deletedAt: null,
        },
        create: {
            kurikulumId: kurTI2020.id,
            mataKuliahId: mkJarkom.id,
            semester: 4,
            minimalSemester: 4,
        },
    });

    console.log('✅ Seed Kurikulum & KurikulumMatkul selesai');

    /**
     * 9. PROGRAM MATKUL - menggunakan composite unique key
     */
    const pmAlgo = await prisma.programMatkul.upsert({
        where: {
            prodiId_periodeId_mataKuliahId_kurikulumId: {
                prodiId: prodiTI.id,
                periodeId: periodeGanjil.id,
                mataKuliahId: mkAlgo.id,
                kurikulumId: kurTI2020.id,
            },
        },
        update: {
            jumlahKelompokKelas: 2,
            deletedAt: null,
        },
        create: {
            prodiId: prodiTI.id,
            periodeId: periodeGanjil.id,
            mataKuliahId: mkAlgo.id,
            kurikulumId: kurTI2020.id,
            jumlahKelompokKelas: 2,
        },
    });

    const pmBD = await prisma.programMatkul.upsert({
        where: {
            prodiId_periodeId_mataKuliahId_kurikulumId: {
                prodiId: prodiTI.id,
                periodeId: periodeGanjil.id,
                mataKuliahId: mkBD.id,
                kurikulumId: kurTI2020.id,
            },
        },
        update: {
            jumlahKelompokKelas: 2,
            deletedAt: null,
        },
        create: {
            prodiId: prodiTI.id,
            periodeId: periodeGanjil.id,
            mataKuliahId: mkBD.id,
            kurikulumId: kurTI2020.id,
            jumlahKelompokKelas: 2,
        },
    });

    console.log('✅ Seed ProgramMatkul selesai');

    /**
     * 10. KELOMPOK KELAS - menggunakan composite unique key
     */
    const kelasA = await prisma.kelompokKelas.upsert({
        where: {
            prodiId_kode_angkatan: {
                prodiId: prodiTI.id,
                kode: 'A',
                angkatan: 2022
            }
        },
        update: {
            kapasitas: 40,
            deletedAt: null,
        },
        create: {
            prodiId: prodiTI.id,
            kode: 'A',
            angkatan: 2022,
            kapasitas: 40,
        },
    });

    const kelasB = await prisma.kelompokKelas.upsert({
        where: {
            prodiId_kode_angkatan: {
                prodiId: prodiTI.id,
                kode: 'B',
                angkatan: 2022
            }
        },
        update: {
            kapasitas: 40,
            deletedAt: null,
        },
        create: {
            prodiId: prodiTI.id,
            kode: 'B',
            angkatan: 2022,
            kapasitas: 40,
        },
    });

    console.log('✅ Seed KelompokKelas selesai');

    /**
     * 11. PENGGUNA ADMIN & DOSEN
     */
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const dosenPasswordHash = await bcrypt.hash('dosen123', 10);

    const adminUser = await prisma.pengguna.upsert({
        where: { email: 'admin@kampus.test' },
        update: {
            nama: 'Admin Fakultas',
            peran: PeranPengguna.ADMIN,
            fakultasId: null,
            prodiId: null,
            password: adminPasswordHash,
            deletedAt: null,
        },
        create: {
            nama: 'Admin Fakultas',
            email: 'admin@kampus.test',
            peran: PeranPengguna.ADMIN,
            password: adminPasswordHash,
        },
    });

    const dosenUser1 = await prisma.pengguna.upsert({
        where: { email: 'dosen1@kampus.test' },
        update: {
            nama: 'Dosen Algoritma',
            peran: PeranPengguna.DOSEN,
            fakultasId: fakultasFTS.id,
            prodiId: prodiTI.id,
            password: dosenPasswordHash,
            deletedAt: null,
        },
        create: {
            nama: 'Dosen Algoritma',
            email: 'dosen1@kampus.test',
            peran: PeranPengguna.DOSEN,
            password: dosenPasswordHash,
            fakultasId: fakultasFTS.id,
            prodiId: prodiTI.id,
        },
    });

    const dosen1 = await prisma.dosen.upsert({
        where: { penggunaId: dosenUser1.id },
        update: {
            nidn: '1234567890',
            prodiId: prodiTI.id,
            bebanMengajarMaks: 12,
            deletedAt: null,
        },
        create: {
            penggunaId: dosenUser1.id,
            nidn: '1234567890',
            prodiId: prodiTI.id,
            bebanMengajarMaks: 12,
        },
    });

    console.log('✅ Seed Pengguna & Dosen selesai');

    /**
     * 12. PENUGASAN MENGAJAR
     */
    await prisma.penugasanMengajar.createMany({
        data: [
            {
                programMatkulId: pmAlgo.id,
                kelompokKelasId: kelasA.id,
                dosenId: dosen1.id,
                jumlahSesiPerMinggu: 2,
                butuhLab: false,
                preferensiRuangJenis: 'TEORI',
                status: StatusPenugasanMengajar.SIAP,
            },
            {
                programMatkulId: pmAlgo.id,
                kelompokKelasId: kelasB.id,
                dosenId: dosen1.id,
                jumlahSesiPerMinggu: 2,
                butuhLab: false,
                preferensiRuangJenis: 'TEORI',
                status: StatusPenugasanMengajar.SIAP,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Seed PenugasanMengajar selesai');

    console.log('🌱 Seeding selesai dengan sukses!');
}

main()
    .catch((e) => {
        console.error('❌ Error saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });