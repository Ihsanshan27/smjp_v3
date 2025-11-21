// src/modules/kurikulum/kurikulum/kurikulum.repository.js
const prisma = require('../../../config/prisma');

async function findMany({ prodiId, aktif, q, page = 1, pageSize = 20 }) {
    const where = {
        deletedAt: null,
        ...(prodiId ? { prodiId } : {}),
        ...(typeof aktif === 'boolean' ? { aktif } : {}),
        ...(q
            ? { nama: { contains: q, mode: 'insensitive' } }
            : {}),
    };

    const [items, total] = await Promise.all([
        prisma.kurikulum.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { prodi: true },
        }),
        prisma.kurikulum.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

function findById(id) {
    return prisma.kurikulum.findUnique({
        where: { id },
        include: {
            prodi: true,
            matkul: {
                where: { deletedAt: null },
                include: { mataKuliah: true },
                orderBy: { semester: 'asc' },
            },
        },
    });
}

function findByProdiNama(prodiId, nama) {
    return prisma.kurikulum.findFirst({
        where: {
            prodiId,
            nama,
            deletedAt: null
        },
    });
}

function create(data) {
    return prisma.kurikulum.create({ data });
}

function update(id, data) {
    return prisma.kurikulum.update({ where: { id }, data });
}

function softDelete(id) {
    return prisma.kurikulum.update({
        where: { id },
        data: { deletedAt: new Date(), aktif: false },
    });
}

async function assignMatkul(kurikulumId, items) {
    const ops = items.map((item) =>
        prisma.kurikulumMatkul.upsert({
            where: {
                kurikulumId_mataKuliahId: {
                    kurikulumId,
                    mataKuliahId: item.mataKuliahId,
                },
            },
            update: {
                semester: item.semester,
                minimalSemester: item.minimalSemester ?? item.semester,
                deletedAt: null,
            },
            create: {
                kurikulumId,
                mataKuliahId: item.mataKuliahId,
                semester: item.semester,
                minimalSemester: item.minimalSemester ?? item.semester,
            },
        })
    );

    return prisma.$transaction(ops);
}

module.exports = {
    findMany,
    findById,
    findByProdiNama,
    create,
    update,
    softDelete,
    assignMatkul,
};
