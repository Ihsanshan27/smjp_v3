const prisma = require('../../config/prisma');
const AppError = require('../../utils/appError');
const repo = require('./perubahanJadwal.repository');

async function listPerubahan(query) {
    return repo.findMany(query);
}

async function getPerubahan(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Pengajuan perubahan tidak ditemukan.', 404, 'PERUBAHAN_NOT_FOUND');
    }
    return data;
}

async function createPerubahan(payload, user) {
    const { id: userId, prodiId: userProdiId } = user;

    // ambil jadwal yang mau diubah
    const jadwal = await prisma.jadwalKuliah.findUnique({
        where: { id: payload.jadwalKuliahId },
        include: {
            hari: true,
            slotWaktu: true,
            ruang: true,
            batch: true,
            penugasanMengajar: {
                include: {
                    programMatkul: {
                        include: {
                            prodi: true,
                            periode: true,
                        },
                    },
                    kelompokKelas: true,
                },
            },
        },
    });

    if (!jadwal || jadwal.deletedAt) {
        throw new AppError('Jadwal kuliah tidak ditemukan.', 404, 'JADWAL_NOT_FOUND');
    }

    if (!jadwal.batch || jadwal.batch.status !== 'FINAL') {
        throw new AppError(
            'Hanya jadwal dari batch FINAL yang dapat diajukan perubahan.',
            400,
            'BATCH_NOT_FINAL'
        );
    }

    // ambil prodi dari programMatkul (fallback ke kelompokKelas kalau perlu)
    const prodi = jadwal.penugasanMengajar?.programMatkul?.prodi;
    if (!prodi) {
        throw new AppError(
            'Data prodi pada jadwal ini tidak lengkap.',
            400,
            'PRODI_NOT_FOUND_ON_JADWAL'
        );
    }

    // optional: batasi prodi yang boleh ajukan
    if (userProdiId && userProdiId !== prodi.id && user.peran === 'TU_PRODI') {
        throw new AppError(
            'Anda tidak berhak mengajukan perubahan jadwal untuk prodi lain.',
            403,
            'FORBIDDEN'
        );
    }

    // jangan sama persis dengan jadwal lama
    if (
        payload.hariBaruId === jadwal.hariId &&
        payload.slotWaktuBaruId === jadwal.slotWaktuId &&
        (payload.ruangBaruId || null) === (jadwal.ruangId || null)
    ) {
        throw new AppError(
            'Jadwal baru tidak boleh sama persis dengan jadwal lama.',
            400,
            'NO_CHANGE'
        );
    }

    const created = await repo.create({
        jadwalKuliahId: jadwal.id,
        hariLamaId: jadwal.hariId,
        slotWaktuLamaId: jadwal.slotWaktuId,
        ruangLamaId: jadwal.ruangId,
        hariBaruId: payload.hariBaruId,
        slotWaktuBaruId: payload.slotWaktuBaruId,
        ruangBaruId: payload.ruangBaruId || null,
        prodiId: prodi.id,
        alasanPengaju: payload.alasanPengaju,
        status: 'DIAJUKAN',
        diajukanOlehId: userId,
    });

    return created;
}

async function approvePerubahan(id, approverId) {
    const perubahan = await repo.findById(id);
    if (!perubahan || perubahan.deletedAt) {
        throw new AppError('Pengajuan perubahan tidak ditemukan.', 404, 'PERUBAHAN_NOT_FOUND');
    }

    if (perubahan.status !== 'DIAJUKAN') {
        throw new AppError(
            'Hanya pengajuan dengan status DIAJUKAN yang dapat disetujui.',
            400,
            'INVALID_STATUS'
        );
    }

    const jadwal = perubahan.jadwalKuliah;
    if (!jadwal || jadwal.deletedAt) {
        throw new AppError('Jadwal terkait sudah tidak ada.', 400, 'JADWAL_NOT_FOUND');
    }

    const penugasan = jadwal.penugasanMengajar;
    if (!penugasan) {
        throw new AppError(
            'Penugasan mengajar pada jadwal ini tidak lengkap.',
            400,
            'PENUGASAN_NOT_FOUND'
        );
    }

    // cek bentrok di Hari+Slot baru
    const konflik = await prisma.jadwalKuliah.findFirst({
        where: {
            deletedAt: null,
            id: { not: jadwal.id },
            hariId: perubahan.hariBaruId,
            slotWaktuId: perubahan.slotWaktuBaruId,
            batchId: jadwal.batchId,
            OR: [
                ...(perubahan.ruangBaruId ? [{ ruangId: perubahan.ruangBaruId }] : []),
                { penugasanMengajar: { dosenId: penugasan.dosenId } },
                { penugasanMengajar: { kelompokKelasId: penugasan.kelompokKelasId } },
            ],
        },
    });

    if (konflik) {
        throw new AppError(
            'Slot waktu/ruang yang diajukan menyebabkan bentrok dengan jadwal lain.',
            400,
            'JADWAL_BENTROK'
        );
    }

    // APPROACH SEDERHANA: Gunakan executeRaw untuk memastikan work
    const result = await prisma.$transaction(async (tx) => {
        // Update jadwal menggunakan executeRaw
        if (perubahan.ruangBaruId) {
            await tx.$executeRaw`
                UPDATE "JadwalKuliah" 
                SET "hariId" = ${perubahan.hariBaruId},
                    "slotWaktuId" = ${perubahan.slotWaktuBaruId},
                    "ruangId" = ${perubahan.ruangBaruId},
                    "updatedAt" = NOW()
                WHERE id = ${jadwal.id}
            `;
        } else {
            await tx.$executeRaw`
                UPDATE "JadwalKuliah" 
                SET "hariId" = ${perubahan.hariBaruId},
                    "slotWaktuId" = ${perubahan.slotWaktuBaruId},
                    "ruangId" = NULL,
                    "updatedAt" = NOW()
                WHERE id = ${jadwal.id}
            `;
        }

        const updatedPerubahan = await tx.pengajuanPerubahanJadwal.update({
            where: { id: perubahan.id },
            data: {
                status: 'DISETUJUI',
                diprosesOlehId: approverId,
                diprosesPada: new Date(),
            },
        });

        return updatedPerubahan;
    });

    return result;
}

async function rejectPerubahan(id, payload, approverId) {
    const perubahan = await repo.findById(id);
    if (!perubahan || perubahan.deletedAt) {
        throw new AppError('Pengajuan perubahan tidak ditemukan.', 404, 'PERUBAHAN_NOT_FOUND');
    }

    if (perubahan.status !== 'DIAJUKAN') {
        throw new AppError(
            'Hanya pengajuan dengan status DIAJUKAN yang dapat ditolak.',
            400,
            'INVALID_STATUS'
        );
    }

    const updated = await repo.update(perubahan.id, {
        status: 'DITOLAK',
        alasanRespon: payload.alasanRespon,
        diprosesOlehId: approverId,
        diprosesPada: new Date(),
    });

    return updated;
}

async function deletePerubahan(id, userId) {
    const perubahan = await repo.findById(id);
    if (!perubahan || perubahan.deletedAt) {
        throw new AppError('Pengajuan perubahan tidak ditemukan.', 404, 'PERUBAHAN_NOT_FOUND');
    }

    if (perubahan.status !== 'DIAJUKAN') {
        throw new AppError(
            'Hanya pengajuan dengan status DIAJUKAN yang dapat dihapus.',
            400,
            'INVALID_STATUS'
        );
    }

    if (perubahan.diajukanOlehId !== userId) {
        throw new AppError(
            'Anda tidak berhak menghapus pengajuan ini.',
            403,
            'FORBIDDEN'
        );
    }

    await repo.softDelete(id);
    return true;
}

module.exports = {
    listPerubahan,
    getPerubahan,
    createPerubahan,
    approvePerubahan,
    rejectPerubahan,
    deletePerubahan,
};
