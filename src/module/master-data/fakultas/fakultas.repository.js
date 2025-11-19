const prisma = require('../../../config/prisma');

async function findMany({ q, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(q ?
            {
                OR: [
                    { kode: { contains: q, mode: 'insensitive' } },
                    { nama: { contains: q, mode: 'insensitive' } },
                ]
            }
            : {})
    }

    const [items, totalItems] = await Promise.all([
        prisma.fakultas.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.fakultas.count({ where })
    ])
    return { items, totalItems, page, pageSize };
}

function findById(id) {
    return prisma.fakultas.findUnique({
        where: { id, deletedAt: null },
    });
}

function findByKode(kode) {
    return prisma.fakultas.findFirst({
        where: { kode, deletedAt: null },
    })
}

function create(data) {
    return prisma.fakultas.create({ data })
}

function update(id, data) {
    return prisma.fakultas.update({
        where: { id },
        data
    })
}

function softDelete(id) {
    return prisma.fakultas.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
}

module.exports = {
    findMany,
    findById,
    findByKode,
    create,
    update,
    softDelete
}