const prisma = require("../../../config/prisma");

async function findMany({ q, fakultasId, prodiId, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(prodiId ? { prodiId } : {}),
        ...(fakultasId ? { fakultasId } : {}),
        ...(q ? {
            OR: [
                { nidn: { contains: q, mode: 'insensitive' } },
                {
                    pengguna: {
                        OR: [
                            { nama: { contains: q, mode: 'insensitive' } },
                            { email: { contains: q, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        } : {}),
    }

    const [items, total] = await Promise.all([
        prisma.dosen.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                pengguna: true,
                prodi: { include: { fakultas: true } }
            },
        }),
        prisma.dosen.count({ where })
    ])

    return {
        items,
        total,
        page,
        pageSize,
    }
}

function findById(id) {
    return prisma.dosen.findUnique({
        where: { id },
        include: {
            pengguna: true,
            prodi: { include: { fakultas: true } }
        },
    })
}

async function findByPenggunaId(penggunaId) {
    if (!penggunaId) return null;
    return prisma.dosen.findUnique({
        where: { penggunaId },
    })
}

function create(data) {
    return prisma.dosen.create({
        data,
    })
}

function update(id, data) {
    return prisma.dosen.update({
        where: { id },
        data,
    })
}

function softDelete(id) {
    return prisma.dosen.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
}

module.exports = {
    findMany,
    findById,
    findByPenggunaId,
    create,
    update,
    softDelete,
};