const { success } = require('../../utils/response');
const service = require('./viewJadwal.service');

async function jadwalDosen(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.getJadwalDosen(query);
        return success(res, result, 'Jadwal dosen berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function jadwalKelas(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.getJadwalKelas(query);
        return success(res, result, 'Jadwal kelas berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function jadwalRuang(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.getJadwalRuang(query);
        return success(res, result, 'Jadwal ruang berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function jadwalProdi(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.getJadwalProdi(query);
        return success(res, result, 'Jadwal prodi berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    jadwalDosen,
    jadwalKelas,
    jadwalRuang,
    jadwalProdi,
};
