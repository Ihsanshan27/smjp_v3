const prisma = require('../../config/prisma');

async function getPenugasanMengajarSiap({ fakultasId, periodeAkademikId }) {
    const whereTA = {
        deletedAt: null,
        status: 'SIAP',
        programMatkul: {
            ...(periodeAkademikId ? { periodeId: periodeAkademikId } : {}),
            ...(fakultasId ? { prodi: { fakultasId } } : {}),
        },
    };

    const taList = await prisma.penugasanMengajar.findMany({
        where: whereTA,
        include: {
            programMatkul: {
                include: {
                    prodi: true,
                    mataKuliah: true,
                    periode: true,
                },
            },
            dosen: {
                include: {
                    pengguna: true,
                    prodi: true,
                },
            },
            kelompokKelas: {
                include: {
                    prodi: true,
                },
            },
        },
    });

    return taList;
}

async function getRuangAktifByFakultas(fakultasId) {
    return prisma.ruang.findMany({
        where: {
            deletedAt: null,
            aktif: true,
            ...(fakultasId ? { fakultasId } : {}),
        },
        include: {
            fakultas: true,
        },
    });
}

async function getHariList() {
    return prisma.hari.findMany({
        where: { deletedAt: null },
        orderBy: { urutan: 'asc' },
    });
}

async function getSlotList() {
    return prisma.slotWaktu.findMany({
        where: { deletedAt: null },
        orderBy: { jamMulai: 'asc' },
    });
}

async function getPreferensiDosenMap(dosenIds) {
    if (!dosenIds || dosenIds.length === 0) return [];

    const prefs = await prisma.preferensiDosen.findMany({
        where: {
            deletedAt: null,
            dosenId: { in: dosenIds },
        },
        include: {
            hari: true,
            slotWaktu: true,
        },
    });

    return prefs;
}

/**
 * Simpan hasil jadwal ke BatchJadwal + JadwalKuliah
 * @param {*} param0
 *  - fakultasId, periodeAkademikId, namaBatch, kromosomTerbaik, stats
 */
// src/modules/scheduler/scheduler.repository.js
async function simpanHasilBatch({
    fakultasId,
    periodeAkademikId,
    namaBatch,
    kromosomTerbaik,
    stats,
    dibuatOlehId,
    ukuranPopulasi,
    jumlahGenerasi,
}) {
    return prisma.$transaction(async (tx) => {
        const batch = await tx.batchJadwal.create({
            data: {
                nama: namaBatch || `Batch ${new Date().toISOString()}`,
                fakultasId,                    // wajib
                periodeId: periodeAkademikId,  // wajib
                status: 'SIAP',

                ukuranPopulasi,
                jumlahGenerasi,
                fitnessTerbaik: stats.fitnessTerbaik ?? null,

                tanggalGenerate: new Date(),
                dibuatOlehId,                  // dari req.user.id
            },
        });

        if (kromosomTerbaik && kromosomTerbaik.length > 0) {
            await tx.jadwalKuliah.createMany({
                data: kromosomTerbaik.map((g) => ({
                    batchId: batch.id,
                    penugasanMengajarId: g.penugasanMengajarId,
                    hariId: g.hariId,
                    slotWaktuId: g.slotWaktuId,
                    ruangId: g.ruangId,
                })),
            });
        }

        return batch;
    });
}

async function listBatch({ fakultasId, periodeAkademikId, status, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(fakultasId ? { fakultasId } : {}),
        ...(periodeAkademikId ? { periodeId: periodeAkademikId } : {}),
        ...(status ? { status } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.batchJadwal.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                fakultas: true,
                periode: true,
            },
        }),
        prisma.batchJadwal.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

async function getBatchById(id) {
    return prisma.batchJadwal.findUnique({
        where: { id },
        include: {
            fakultas: true,
            periode: true,
            jadwal: {
                include: {
                    penugasanMengajar: {
                        include: {
                            programMatkul: {
                                include: {
                                    prodi: true,
                                    mataKuliah: true,
                                    periode: true,
                                },
                            },
                            dosen: {
                                include: { pengguna: true, prodi: true },
                            },
                            kelompokKelas: {
                                include: { prodi: true },
                            },
                        },
                    },
                    hari: true,
                    slotWaktu: true,
                    ruang: true,
                },
            },
        },
    });
}

async function listJadwalWithFilter({
    batchId,
    fakultasId,
    periodeAkademikId,
    prodiId,
    dosenId,
    kelompokKelasId,
    hariId,
    page = 1,
    pageSize = 100,
}) {
    const where = {
        batch: {
            deletedAt: null,
            ...(batchId ? { id: batchId } : {}),
            ...(fakultasId ? { fakultasId } : {}),
            ...(periodeAkademikId ? { periodeId: periodeAkademikId } : {}),
        },
        ...(hariId ? { hariId } : {}),
        ...(dosenId || prodiId || kelompokKelasId
            ? {
                penugasanMengajar: {
                    ...(dosenId ? { dosenId } : {}),
                    ...(kelompokKelasId ? { kelompokKelasId } : {}),
                    ...(prodiId
                        ? {
                            programMatkul: {
                                prodiId,
                            },
                        }
                        : {}),
                },
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.jadwalKuliah.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: [
                { hari: { urutan: 'asc' } },
                { slotWaktu: { jamMulai: 'asc' } },
            ],
            include: {
                hari: true,
                slotWaktu: true,
                ruang: true,
                penugasanMengajar: {
                    include: {
                        programMatkul: {
                            include: { mataKuliah: true, prodi: true, periode: true },
                        },
                        dosen: { include: { pengguna: true } },
                        kelompokKelas: { include: { prodi: true } },
                    },
                },
                batch: true,
            },
        }),
        prisma.jadwalKuliah.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

async function logFinalGaForBatch({ batchId, generasi, fitness, kromosomTerbaik }) {
    return prisma.$transaction(async (tx) => {
        const krom = await tx.gaKromosom.create({
            data: {
                batchId,
                generasi,
                fitness,
                isBest: true,
            },
        });

        if (kromosomTerbaik && kromosomTerbaik.length > 0) {
            await tx.gaGen.createMany({
                data: kromosomTerbaik.map((g) => ({
                    kromosomId: krom.id,
                    penugasanMengajarId: g.penugasanMengajarId,
                    hariId: g.hariId,
                    slotWaktuId: g.slotWaktuId,
                    ruangId: g.ruangId,
                    dosenId: g.dosenId,
                })),
            });
        }

        return krom;
    });
}

async function setBatchFinal(id) {
    return prisma.$transaction(async (tx) => {
        const batch = await tx.batchJadwal.findUnique({ where: { id } });
        if (!batch || batch.deletedAt) {
            throw new Error('Batch tidak ditemukan.');
        }

        // set semua batch lain di kombinasi fakultas+periode ke SIAP
        await tx.batchJadwal.updateMany({
            where: {
                deletedAt: null,
                fakultasId: batch.fakultasId,
                periodeId: batch.periodeId,
                id: { not: batch.id },
            },
            data: {
                status: 'SIAP',
            },
        });

        // set batch ini ke FINAL
        return tx.batchJadwal.update({
            where: { id: batch.id },
            data: {
                status: 'FINAL',
            },
        });
    });
}

async function setBatchStatus(id, status) {
    return prisma.$transaction(async (tx) => {
        const batch = await tx.batchJadwal.findUnique({
            where: { id },
        })

        if (!batch || batch.deletedAt) {
            throw new Error('Batch tidak ditemukan.');
        }

        if (status === 'FINAL') {
            await tx.batchJadwal.updateMany({
                where: {
                    deletedAt: null,
                    fakultasId: batch.fakultasId,
                    periodeId: batch.periodeId,
                    id: { not: batch.id },
                },
                data: {
                    status: 'SIAP',
                },
            });
        }

        const updated = await tx.batchJadwal.update({
            where: { id: batch.id },
            data: {
                status,
            },
        });

        return updated;
    })
}

async function deleteBatchWithItems(id) {
    return prisma.$transaction(async (tx) => {
        const batch = await tx.batchJadwal.findUnique({ where: { id } })

        if (!batch || batch.deletedAt) {
            throw new Error('Batch tidak ditemukan.');
        }

        const now = new Date()
        await tx.jadwalKuliah.updateMany({
            where: {
                batchId: batch.id,
                deletedAt: null,
            },
            data: {
                deletedAt: now,
            },
        })

        await tx.gaGen.deleteMany({
            where: {
                kromosom: {
                    batchId: batch.id,
                },
            },
        });

        await tx.gaKromosom.deleteMany({
            where: {
                batchId: batch.id,
            },
        });
        const updatedBatch = await tx.batchJadwal.update({
            where: { id: batch.id },
            data: {
                deletedAt: now,
                status: 'SIAP', // opsional, biar ga FINAL di data mati
            },
        });

        return updatedBatch;

    })
}


module.exports = {
    getPenugasanMengajarSiap,
    getRuangAktifByFakultas,
    getHariList,
    getSlotList,
    getPreferensiDosenMap,
    simpanHasilBatch,
    listBatch,
    getBatchById,
    listJadwalWithFilter,
    logFinalGaForBatch,
    setBatchFinal,
    setBatchStatus,
    deleteBatchWithItems,
};
