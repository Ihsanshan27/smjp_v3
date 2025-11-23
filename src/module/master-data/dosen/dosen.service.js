const AppError = require('../../../utils/appError');
const repo = require('./dosen.repository');
const prodiRepo = require('../prodi/prodi.repository');

async function listDosen(query) {
    return repo.findMany(query);
}

async function getDosen(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Dosen tidak ditemukan.', 404, 'DOSEN_NOT_FOUND');
    }
    return data;
}

async function createDosen(payload) {
    // cek hanya jika penggunaId dikirim
    if (payload.penggunaId) {
        const existing = await repo.findByPenggunaId(payload.penggunaId);
        if (existing && !existing.deletedAt) {
            throw new AppError('Dosen sudah ada.', 400, 'DOSEN_EXISTS');
        }
    }

    // AUTO SET fakultasId dari prodiId
    if (payload.prodiId) {
        const prodi = await prodiRepo.findById(payload.prodiId);

        if (prodi) {
            payload.fakultasId = prodi.fakultasId;
        }
    }

    return repo.create({
        penggunaId: payload.penggunaId ?? null,
        nama: payload.nama,
        nidn: payload.nidn,
        fakultasId: payload.fakultasId,
        prodiId: payload.prodiId,
        bebanMengajarMaks: payload.bebanMengajarMaks,
    });
}

async function updateDosen(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Dosen tidak ditemukan.', 404, 'DOSEN_NOT_FOUND');
    }

    return await repo.update(id, {
        ...(payload.penggunaId ? { penggunaId: payload.penggunaId } : {}),
        ...(payload.nama ? { nama: payload.nama } : {}),
        ...(payload.nidn ? { nidn: payload.nidn } : {}),
        ...(payload.prodiId ? { prodiId: payload.prodiId } : {}),
        ...(payload.bebanMengajarMaks ? { bebanMengajarMaks: payload.bebanMengajarMaks } : {}),
    });
}

async function deleteDosen(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Dosen tidak ditemukan.', 404, 'DOSEN_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

module.exports = {
    listDosen,
    getDosen,
    createDosen,
    updateDosen,
    deleteDosen,
}
