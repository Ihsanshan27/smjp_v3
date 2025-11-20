const prisma = require('../../../config/prisma');

async function findMany({ fakultasId, aktif, q, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(fakultasId ? { fakultasId } : {}),
        ...(typeof aktif === 'boolean' ? { aktif } : {}),
        ...(q
            ? {
                OR: [
                    { kode: { contains: q, mode: 'insensitive' } },
                    { nama: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.ruang.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { fakultas: true },
        }),
        prisma.ruang.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.ruang.findUnique({
        where: { id },
        include: { fakultas: true },
    });
}

function findByKode(fakultasId, kode) {
    return prisma.ruang.findUnique({
        where: {
            fakultasId_kode: {
                fakultasId,
                kode,
            },
        },
    });
}

function create(data) {
    return prisma.ruang.create({ data });
}

function update(id, data) {
    return prisma.ruang.update({
        where: { id },
        data,
    });
}

function softDelete(id) {
    return prisma.ruang.update({
        where: { id },
        data: { deletedAt: new Date(), aktif: false },
    });
}

module.exports = {
    findMany,
    findById,
    findByKode,
    create,
    update,
    softDelete,
};
