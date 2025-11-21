const AppError = require('../../../utils/appError')
const matkulRepo = require('./mataKuliah.repository')

async function listMatkul(query) {
    return matkulRepo.findMany(query)
}

async function getMatkul(id) {
    const matkul = await matkulRepo.findById(id)
    if (!matkul || matkul.deletedAt) {
        throw new AppError('Mata kuliah tidak ditemukan', 404, 'MATKUL_NOT_FOUND')
    }
    return matkul
}

async function createMatkul(payload) {
    const existing = await matkulRepo.findByKode(payload.kode);
    if (existing && !existing.deletedAt) {
        throw new AppError('Kode mata kuliah sudah digunakan.', 400, 'KODE_EXISTS');
    }

    return matkulRepo.create({
        kode: payload.kode,
        nama: payload.nama,
        sks: payload.sks ?? 0,
        jenis: payload.jenis,
    });
}


async function updateMatkul(id, payload) {
    const data = await matkulRepo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Mata kuliah tidak ditemukan.', 404, 'MATKUL_NOT_FOUND');
    }

    if (payload.kode && payload.kode !== data.kode) {
        const existing = await matkulRepo.findByKode(payload.kode);
        if (existing && !existing.deletedAt) {
            throw new AppError('Kode mata kuliah sudah digunakan.', 400, 'KODE_EXISTS');
        }
    }

    return matkulRepo.update(id, {
        ...(payload.kode ? { kode: payload.kode } : {}),
        ...(payload.nama ? { nama: payload.nama } : {}),
        ...(payload.sks ? { sks: payload.sks } : {}),
        ...(payload.jenis ? { jenis: payload.jenis } : {}),
    });
}


async function deleteMatkul(id) {
    const data = await matkulRepo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Mata kuliah tidak ditemukan.', 404, 'MATKUL_NOT_FOUND');
    }
    const deleted = await matkulRepo.softDelete(id);
    return deleted;
}

module.exports = {
    listMatkul,
    getMatkul,
    createMatkul,
    updateMatkul,
    deleteMatkul
}