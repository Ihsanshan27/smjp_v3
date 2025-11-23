const prisma = require("../../../config/prisma");

async function findMany({ q, prodiId, angkatan, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(prodiId ? { prodiId } : {}),
        ...(angkatan ? { angkatan } : {}),
        ...(q
            ? {
                OR: [
                    { kode: { contains: q, mode: 'insensitive' } },
                    {
                        prodi: {
                            nama: { contains: q, mode: 'insensitive' }
                        }
                    }
                ]
            } : {}
        )
    }

    const [items, total] = await Promise.all([
        prisma.kelompokKelas.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { prodi: true },
            orderBy: [{ createdAt: 'desc' }]
        }),
        prisma.kelompokKelas.count({
            where
        })
    ])
    return { items, total, page, pageSize }
}

function findById(id) {
    return prisma.kelompokKelas.findUnique({
        where: { id },
        include: { prodi: true }
    })
}

function findByUnique(prodiId, kode, angkatan) {
    return prisma.kelompokKelas.findUnique({
        where: {
            prodiId_kode_angkatan: {
                prodiId,
                kode,
                angkatan
            }
        }
    })
}

function create(data) {
    return prisma.kelompokKelas.create({
        data,
        include: { prodi: true }
    })
}

function update(id, data) {
    return prisma.kelompokKelas.update({
        where: { id },
        data,
        include: { prodi: true }
    })
}

function remove(id) {
    return prisma.kelompokKelas.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
}

module.exports = {
    findMany,
    findById,
    findByUnique,
    create,
    update,
    remove
}

