const prisma = require('../../../config/prisma');

async function findMany({ dosenId, hariId, slotWaktuId, page = 1, pageSize = 50 }) {
    const where = {
        deletedAt: null,
        ...(dosenId ? { dosenId } : {}),
        ...(hariId ? { hariId } : {}),
        ...(slotWaktuId ? { slotWaktuId } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.preferensiDosen.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: [
                { dosenId: 'asc' },
                { hariId: 'asc' },
                { slotWaktuId: 'asc' },
            ],
            include: {
                dosen: { include: { pengguna: true, prodi: true } },
                hari: true,
                slotWaktu: true,
            },
        }),
        prisma.preferensiDosen.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.preferensiDosen.findUnique({
        where: { id },
        include: {
            dosen: { include: { pengguna: true, prodi: true } },
            hari: true,
            slotWaktu: true,
        },
    });
}

function findByUnique({ dosenId, hariId, slotWaktuId }) {
    return prisma.preferensiDosen.findFirst({
        where: {
            dosenId,
            hariId,
            slotWaktuId,
            deletedAt: null
        },
        include: {
            dosen: { include: { pengguna: true, prodi: true } },
            hari: true,
            slotWaktu: true,
        },
    });
}

function create(data) {
    return prisma.preferensiDosen.create({
        data,
        include: {
            dosen: { include: { pengguna: true, prodi: true } },
            hari: true,
            slotWaktu: true,
        },
    });
}

function update(id, data) {
    return prisma.preferensiDosen.update({
        where: { id },
        data,
        include: {
            dosen: { include: { pengguna: true, prodi: true } },
            hari: true,
            slotWaktu: true,
        },
    });
}

function softDelete(id) {
    return prisma.preferensiDosen.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

module.exports = {
    findMany,
    findById,
    findByUnique,
    create,
    update,
    softDelete,
};
