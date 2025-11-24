const prisma = require('../../../config/prisma');

async function findMany({ prodiId, periodeId, status, dosenId, kelasId, page = 1, pageSize = 50 }) {
    const where = {
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(dosenId ? { dosenId } : {}),
        ...(kelasId ? { kelompokKelasId: kelasId } : {}),
        ...(prodiId || periodeId
            ? {
                programMatkul: {
                    ...(prodiId ? { prodiId } : {}),
                    ...(periodeId ? { periodeId } : {}),
                },
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.penugasanMengajar.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                programMatkul: {
                    include: {
                        mataKuliah: true,
                        periode: true,
                        prodi: true,
                    },
                },
                kelompokKelas: true,
                dosen: {
                    include: { pengguna: true },
                },
            },
        }),
        prisma.penugasanMengajar.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.penugasanMengajar.findUnique({
        where: { id },
        include: {
            programMatkul: {
                include: {
                    mataKuliah: true,
                    periode: true,
                    prodi: true
                },
            },
            kelompokKelas: true,
            dosen: {
                include: {
                    pengguna: true
                }
            },
        },
    });
}

function create(data) {
    return prisma.penugasanMengajar.create({
        data,
        include: {
            programMatkul: {
                include: {
                    mataKuliah: true,
                    periode: true,
                    prodi: true
                },
            },
            kelompokKelas: true,
            dosen: {
                include: {
                    pengguna: true
                }
            },
        },
    });
}

function update(id, data) {
    return prisma.penugasanMengajar.update({ where: { id }, data });
}

function softDelete(id) {
    return prisma.penugasanMengajar.update({
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
