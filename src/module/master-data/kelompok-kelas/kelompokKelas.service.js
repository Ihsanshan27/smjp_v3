const AppError = require("../../../utils/appError");
const repo = require("./kelompokKelas.repository");

async function listKelas(query) {
    return repo.findMany(query);
}

async function getKelas(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) throw new AppError("Data tidak ditemukan", 404, 'KELAS_NOT_FOUND');
    return data;
}

async function createKelas(payload) {
    const existing = await repo.findByUnique(payload.prodiId, payload.kode, payload.angkatan);
    if (existing && !existing.deletedAt) throw new AppError("Data sudah ada", 400, 'KELAS_EXISTS');

    return repo.create({
        prodiId: payload.prodiId,
        kode: payload.kode,
        angkatan: payload.angkatan,
        kapasitas: payload.kapasitas ?? null,
    })
}

async function updateKelas(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Kelompok kelas tidak ditemukan.', 404, 'KELAS_NOT_FOUND');
    }

    const newProdiId = data.prodiId; // prodiId gak diubah lewat endpoint ini
    const newKode = payload.kode ?? data.kode;
    const newAngkatan = payload.angkatan ?? data.angkatan;

    if (newKode !== data.kode || newAngkatan !== data.angkatan) {
        const existing = await repo.findByUnique(newProdiId, newKode, newAngkatan);
        if (existing && existing.id !== id && !existing.deletedAt) {
            throw new AppError(
                'Kelompok kelas dengan kode & angkatan ini sudah ada di prodi tersebut.',
                400,
                'KELAS_EXISTS'
            );
        }
    }

    return repo.update(id, {
        kode: newKode,
        angkatan: newAngkatan,
        ...(payload.kapasitas !== undefined ? { kapasitas: payload.kapasitas } : {}),
    });
}

async function deleteKelas(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Kelompok kelas tidak ditemukan.', 404, 'KELAS_NOT_FOUND');
    }

    const deleted = await repo.remove(id);
    return deleted;
}

module.exports = {
    listKelas,
    getKelas,
    createKelas,
    updateKelas,
    deleteKelas
}
