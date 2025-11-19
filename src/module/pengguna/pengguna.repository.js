const prisma = require('../../config/prisma');

async function findMany({ q, peran, fakultasId, prodiId, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(peran ? { peran } : {}),
        ...(fakultasId ? { fakultasId } : {}),
        ...(prodiId ? { prodiId } : {}),
        ...(q
            ? {
                OR: [
                    { nama: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ]
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.pengguna.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { fakultas: true, prodi: true }
        }),
        prisma.pengguna.count({ where })
    ])
    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.pengguna.findUnique({
        where: { id, deletedAt: null },
        include: { fakultas: true, prodi: true },
    });
}

function findByEmail(email) {
    return prisma.pengguna.findUnique({
        where: { email },
    });
}

function create(data) {
    return prisma.pengguna.create({ data });
}

function update(id, data) {
    return prisma.pengguna.update({
        where: { id },
        data,
    });
}

function softDelete(id) {
    return prisma.pengguna.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

module.exports = {
    findMany,
    findById,
    findByEmail,
    create,
    update,
    softDelete,
};