const AppError = require('../../../utils/appError');
const repo = require('./ruang.repository');

async function listRuang(query) {
    return repo.findMany(query);
}

async function getRuang(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Ruang tidak ditemukan.', 404, 'RUANG_NOT_FOUND');
    }
    return data;
}

async function createRuang(payload) {
    const existing = await repo.findByKode(payload.fakultasId, payload.kode);
    if (existing && !existing.deletedAt) {
        throw new AppError('Kode ruang sudah digunakan di fakultas ini.', 400, 'KODE_EXISTS');
    }

    return repo.create({
        fakultasId: payload.fakultasId,
        kode: payload.kode,
        nama: payload.nama,
        kapasitas: payload.kapasitas,
        jenis: payload.jenis,
        lokasi: payload.lokasi || null,
        aktif: payload.aktif ?? true,
    });
}

async function updateRuang(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Ruang tidak ditemukan.', 404, 'RUANG_NOT_FOUND');
    }

    return repo.update(id, {
        ...(payload.nama ? { nama: payload.nama } : {}),
        ...(payload.kapasitas ? { kapasitas: payload.kapasitas } : {}),
        ...(payload.jenis ? { jenis: payload.jenis } : {}),
        ...(payload.lokasi !== undefined ? { lokasi: payload.lokasi } : {}),
        ...(typeof payload.aktif === 'boolean' ? { aktif: payload.aktif } : {}),
    });
}

async function deleteRuang(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Ruang tidak ditemukan.', 404, 'RUANG_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

async function setAktif(id, aktif) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Ruang tidak ditemukan.', 404, 'RUANG_NOT_FOUND');
    }

    return repo.update(id, { aktif });
}

module.exports = {
    listRuang,
    getRuang,
    createRuang,
    updateRuang,
    deleteRuang,
    setAktif,
};
