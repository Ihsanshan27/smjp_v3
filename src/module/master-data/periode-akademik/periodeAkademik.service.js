const AppError = require('../../../utils/appError');
const repo = require('./periodeAkademik.repository');

async function listPeriode(query) {
    return repo.findMany(query);
}

async function getPeriode(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Periode akademik tidak ditemukan.', 404, 'PERIODE_NOT_FOUND');
    }
    return data;
}

async function createPeriode(payload) {
    return repo.create({
        fakultasId: payload.fakultasId,
        nama: payload.nama,
        paruh: payload.paruh,
        tahunMulai: payload.tahunMulai,
        tahunSelesai: payload.tahunSelesai,
        tanggalMulai: payload.tanggalMulai,
        tanggalSelesai: payload.tanggalSelesai,
        aktif: payload.aktif ?? false,
    });
}

async function updatePeriode(id, payload) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Periode akademik tidak ditemukan.', 404, 'PERIODE_NOT_FOUND');
    }

    return repo.update(id, payload);
}

async function deletePeriode(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Periode akademik tidak ditemukan.', 404, 'PERIODE_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

async function setPeriodeAktif(id) {
    const updated = await repo.setAktif(id);
    if (!updated) {
        throw new AppError('Periode akademik tidak ditemukan.', 404, 'PERIODE_NOT_FOUND');
    }
    return updated;
}

module.exports = {
    listPeriode,
    getPeriode,
    createPeriode,
    updatePeriode,
    deletePeriode,
    setPeriodeAktif,
};
