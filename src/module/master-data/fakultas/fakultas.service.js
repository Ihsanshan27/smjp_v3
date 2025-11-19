// src/modules/master/fakultas/fakultas.service.js
const AppError = require('../../../utils/appError');
const repo = require('./fakultas.repository');

async function listFakultas(query) {
    return repo.findMany(query);
}

async function getFakultas(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Fakultas tidak ditemukan.', 404, 'FAKULTAS_NOT_FOUND');
    }
    return data;
}

async function createFakultas(payload) {
    const existing = await repo.findByKode(payload.kode);
    if (existing && !existing.deletedAt) {
        throw new AppError('Kode fakultas sudah digunakan.', 400, 'KODE_EXISTS');
    }

    return repo.create({
        kode: payload.kode,
        nama: payload.nama,
    });
}

async function updateFakultas(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Fakultas tidak ditemukan.', 404, 'FAKULTAS_NOT_FOUND');
    }

    // kalau ganti kode, cek bentrok
    if (payload.kode && payload.kode !== data.kode) {
        const existing = await repo.findByKode(payload.kode);
        if (existing && !existing.deletedAt) {
            throw new AppError('Kode fakultas sudah digunakan.', 400, 'KODE_EXISTS');
        }
    }

    return repo.update(id, {
        ...(payload.kode ? { kode: payload.kode } : {}),
        ...(payload.nama ? { nama: payload.nama } : {}),
    });
}

async function deleteFakultas(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Fakultas tidak ditemukan.', 404, 'FAKULTAS_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

module.exports = {
    listFakultas,
    getFakultas,
    createFakultas,
    updateFakultas,
    deleteFakultas,
};
