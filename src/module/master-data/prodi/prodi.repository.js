const prisma = require('../../../config/prisma');

async function findMany({ q, fakultasId, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(fakultasId ? { fakultasId } : {}),
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
        prisma.prodi.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { nama: 'asc' },
            include: { fakultas: true },
        }),
        prisma.prodi.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.prodi.findUnique({
        where: { id },
        include: { fakultas: true },
    });
}

function findByKode(kode) {
    return prisma.prodi.findFirst({
        where: { kode, deletedAt: null },
    });
}

function create(data) {
    return prisma.prodi.create({ data });
}

function update(id, data) {
    return prisma.prodi.update({
        where: { id },
        data,
    });
}

function softDelete(id) {
    return prisma.prodi.update({
        where: { id },
        data: { deletedAt: new Date() },
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
