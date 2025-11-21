const prisma = require('../../../config/prisma');

async function findMany({ q, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(q
            ? {
                OR: [
                    { kode: { contains: q, mode: 'insensitive' } },
                    { nama: { contains: q, mode: 'insensitive' } }
                ]
            }
            : {})
    }

    const [items, total] = await Promise.all([
        prisma.mataKuliah.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.mataKuliah.count({ where })
    ])
    return { items, total, page, pageSize }
}

function findById(id) {
    return prisma.mataKuliah.findUnique({ where: { id } });
}

function findByKode(kode) {
    return prisma.mataKuliah.findFirst({ where: { kode, deletedAt: null } });
}

function create(data) {
    return prisma.mataKuliah.create({ data });
}

function update(id, data) {
    return prisma.mataKuliah.update({ where: { id }, data });
}

function softDelete(id) {
    return prisma.mataKuliah.update({
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
    softDelete
}