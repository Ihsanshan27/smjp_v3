const prisma = require('../../config/prisma');

async function findMany({ prodiId, status, periodeId, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(prodiId ? { prodiId } : {}),
        ...(status ? { status } : {}),
        ...(periodeId
            ? {
                jadwalKuliah: {
                    batch: {
                        periodeId,
                    },
                },
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.pengajuanPerubahanJadwal.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                prodi: true,
                diajukanOleh: true,
                diprosesOleh: true,
                jadwalKuliah: {
                    include: {
                        hari: true,
                        slotWaktu: true,
                        ruang: true,
                        batch: true,
                        penugasanMengajar: {
                            include: {
                                programMatkul: {
                                    include: {
                                        mataKuliah: true,
                                        prodi: true,
                                        periode: true,
                                    },
                                },
                                dosen: {
                                    include: { pengguna: true },
                                },
                                kelompokKelas: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.pengajuanPerubahanJadwal.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.pengajuanPerubahanJadwal.findUnique({
        where: { id },
        include: {
            prodi: true,
            diajukanOleh: true,
            diprosesOleh: true,
            jadwalKuliah: {
                include: {
                    hari: true,
                    slotWaktu: true,
                    ruang: true,
                    batch: true,
                    penugasanMengajar: {
                        include: {
                            programMatkul: {
                                include: {
                                    mataKuliah: true,
                                    prodi: true,
                                    periode: true,
                                },
                            },
                            dosen: {
                                include: { pengguna: true },
                            },
                            kelompokKelas: true,
                        },
                    },
                },
            },
        },
    });
}

function create(data) {
    return prisma.pengajuanPerubahanJadwal.create({ data });
}

function update(id, data) {
    return prisma.pengajuanPerubahanJadwal.update({
        where: { id },
        data,
    });
}

function softDelete(id) {
    return prisma.pengajuanPerubahanJadwal.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

module.exports = {
    findMany,
    findById,
    create,
    update,
    softDelete,
};
