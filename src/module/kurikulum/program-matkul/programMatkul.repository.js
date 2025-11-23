const prisma = require('../../../config/prisma');

async function findMany({ prodiId, periodeId, q, page, pageSize }) {
    const where = {
        deletedAt: null,
        ...(prodiId ? { prodiId } : {}),
        ...(periodeId ? { periodeId } : {}),
        ...(q ? {
            OR: [
                { kode: { contains: q, mode: 'insensitive' } },
                {
                    mataKuliah: {
                        nama: { contains: q, mode: 'insensitive' }
                    }
                }
            ]
        } : {})
    };

    const [items, total] = await Promise.all([
        prisma.programMatkul.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                prodi: true,
                periode: true,
                mataKuliah: true,
                kurikulum: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.programMatkul.count({ where })
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.programMatkul.findUnique({
        where: { id },
        include: {
            prodi: true,
            periode: true,
            mataKuliah: true,
            kurikulum: true
        }
    });
}

function findByUnique({ prodiId, periodeId, mataKuliahId, kurikulumId }) {
    return prisma.programMatkul.findUnique({
        where: {
            prodiId_periodeId_mataKuliahId_kurikulumId: {
                prodiId,
                periodeId,
                mataKuliahId,
                kurikulumId: kurikulumId ?? null
            }
        }
    });
}

function create(data) {
    return prisma.programMatkul.create({
        data,
        include: {
            prodi: true,
            periode: true,
            mataKuliah: true,
            kurikulum: true
        }
    });
}

function update(id, data) {
    return prisma.programMatkul.update({
        where: { id },
        data,
        include: {
            prodi: true,
            periode: true,
            mataKuliah: true,
            kurikulum: true
        }
    });
}

function softDelete(id) {
    return prisma.programMatkul.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
}

module.exports = {
    findMany,
    findById,
    findByUnique,
    create,
    update,
    softDelete
};
