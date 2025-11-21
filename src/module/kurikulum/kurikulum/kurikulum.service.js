const AppError = require('../../../utils/appError');
const repo = require('./kurikulum.repository');

async function listKurikulum(query) {
    return repo.findMany(query);
}

async function getKurikulum(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Kurikulum tidak ditemukan.', 404, 'KURIKULUM_NOT_FOUND');
    }
    return data;
}

async function createKurikulum(payload) {
    const existing = await repo.findByProdiNama(payload.prodiId, payload.nama);
    if (existing && !existing.deletedAt) {
        throw new AppError('Nama kurikulum sudah digunakan di prodi ini.', 400, 'NAMA_EXISTS');
    }

    return repo.create({
        prodiId: payload.prodiId,
        nama: payload.nama,
        angkatanMulai: payload.angkatanMulai,
        angkatanSelesai: payload.angkatanSelesai ?? null,
        aktif: payload.aktif ?? true,
    });
}

async function updateKurikulum(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Kurikulum tidak ditemukan.', 404, 'KURIKULUM_NOT_FOUND');
    }

    return repo.update(id, payload);
}

async function deleteKurikulum(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Kurikulum tidak ditemukan.', 404, 'KURIKULUM_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

async function assignMatkul(kurikulumId, items) {
    const data = await repo.findById(kurikulumId);
    if (!data || data.deletedAt) {
        throw new AppError('Kurikulum tidak ditemukan.', 404, 'KURIKULUM_NOT_FOUND');
    }

    return repo.assignMatkul(kurikulumId, items);
}

module.exports = {
    listKurikulum,
    getKurikulum,
    createKurikulum,
    updateKurikulum,
    deleteKurikulum,
    assignMatkul,
};
