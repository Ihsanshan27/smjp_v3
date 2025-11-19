const AppError = require('../../../utils/appError');
const repo = require('./prodi.repository');

async function listProdi(query) {
    return repo.findMany(query);
}

async function getProdi(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Prodi tidak ditemukan.', 404, 'PRODI_NOT_FOUND');
    }
    return data;
}

async function createProdi(payload) {
    const existing = await repo.findByKode(payload.kode);
    if (existing && !existing.deletedAt) {
        throw new AppError('Kode prodi sudah digunakan.', 400, 'KODE_EXISTS');
    }

    return repo.create({
        fakultasId: payload.fakultasId,
        kode: payload.kode,
        nama: payload.nama,
        jenjang: payload.jenjang,
    });
}

async function updateProdi(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Prodi tidak ditemukan.', 404, 'PRODI_NOT_FOUND');
    }

    if (payload.kode && payload.kode !== data.kode) {
        const existing = await repo.findByKode(payload.kode);
        if (existing && !existing.deletedAt) {
            throw new AppError('Kode prodi sudah digunakan.', 400, 'KODE_EXISTS');
        }
    }

    return repo.update(id, {
        ...(payload.kode ? { kode: payload.kode } : {}),
        ...(payload.nama ? { nama: payload.nama } : {}),
        ...(payload.jenjang ? { jenjang: payload.jenjang } : {}),
    });
}

async function deleteProdi(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Prodi tidak ditemukan.', 404, 'PRODI_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

module.exports = {
    listProdi,
    getProdi,
    createProdi,
    updateProdi,
    deleteProdi,
};
