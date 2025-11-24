const AppError = require('../../../utils/appError');
const repo = require('./penugasanMengajar.repository');

async function listPenugasan(query) {
    return repo.findMany(query);
}

async function getPenugasan(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Penugasan mengajar tidak ditemukan.', 404, 'PENUGASAN_NOT_FOUND');
    }
    return data;
}

async function createPenugasan(payload) {
    return repo.create({
        programMatkulId: payload.programMatkulId,
        kelompokKelasId: payload.kelompokKelasId,
        dosenId: payload.dosenId,
        jumlahSesiPerMinggu: payload.jumlahSesiPerMinggu,
        butuhLab: payload.butuhLab ?? false,
        preferensiRuangJenis: payload.preferensiRuangJenis || null,
        status: payload.status ?? 'DRAF',
    });
}

async function updatePenugasan(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Penugasan mengajar tidak ditemukan.', 404, 'PENUGASAN_NOT_FOUND');
    }

    return repo.update(id, {
        ...(payload.programMatkulId ? { programMatkulId: payload.programMatkulId } : {}),
        ...(payload.kelompokKelasId ? { kelompokKelasId: payload.kelompokKelasId } : {}),
        ...(payload.dosenId ? { dosenId: payload.dosenId } : {}),
        ...(payload.jumlahSesiPerMinggu
            ? { jumlahSesiPerMinggu: payload.jumlahSesiPerMinggu }
            : {}),
        ...(typeof payload.butuhLab === 'boolean' ? { butuhLab: payload.butuhLab } : {}),
        ...(payload.preferensiRuangJenis !== undefined
            ? { preferensiRuangJenis: payload.preferensiRuangJenis }
            : {}),
        ...(payload.status ? { status: payload.status } : {}),
    });
}

async function setStatus(id, status) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Penugasan mengajar tidak ditemukan.', 404, 'PENUGASAN_NOT_FOUND');
    }

    return repo.update(id, { status });
}

async function deletePenugasan(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Penugasan mengajar tidak ditemukan.', 404, 'PENUGASAN_NOT_FOUND');
    }
    const deleted = await repo.softDelete(id);
    return deleted;
}

module.exports = {
    listPenugasan,
    getPenugasan,
    createPenugasan,
    updatePenugasan,
    setStatus,
    deletePenugasan,
};
