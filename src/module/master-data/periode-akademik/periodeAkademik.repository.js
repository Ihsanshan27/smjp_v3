const prisma = require('../../../config/prisma');

async function findMany({ q, fakultasId, paruh, aktif, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(fakultasId ? { fakultasId } : {}),
        ...(paruh ? { paruh } : {}),
        ...(typeof aktif === 'boolean' ? { aktif } : {}),
        ...(q
            ? {
                nama: { contains: q, mode: 'insensitive' },
            }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.periodeAkademik.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { tahunMulai: 'desc' },
            include: { fakultas: true },
        }),
        prisma.periodeAkademik.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.periodeAkademik.findUnique({
        where: { id },
        include: { fakultas: true },
    });
}

function create(data) {
    return prisma.periodeAkademik.create({ data });
}

function update(id, data) {
    return prisma.periodeAkademik.update({
        where: { id },
        data,
    });
}

function softDelete(id) {
    return prisma.periodeAkademik.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

async function setAktif(id) {
    const periode = await prisma.periodeAkademik.findUnique({ where: { id } });
    if (!periode || periode.deletedAt) return null;

    // matikan periode lain di fakultas yg sama
    await prisma.periodeAkademik.updateMany({
        where: {
            fakultasId: periode.fakultasId,
            deletedAt: null,
        },
        data: { aktif: false },
    });

    return prisma.periodeAkademik.update({
        where: { id },
        data: { aktif: true },
    });
}

module.exports = {
    findMany,
    findById,
    create,
    update,
    softDelete,
    setAktif,
};
