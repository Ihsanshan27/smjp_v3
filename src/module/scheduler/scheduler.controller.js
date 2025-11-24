const { success } = require('../../utils/response');
const schedulerService = require('./scheduler.service');

async function generate(req, res, next) {
    try {
        const { body } = req.validated;
        const userId = req.user?.id;
        const result = await schedulerService.generateJadwalOtomatis({
            ...body,
            dibuatOlehId: userId,
        });
        return success(res, result, 'Proses generate jadwal selesai.');
    } catch (err) {
        next(err);
    }
}

async function listBatch(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await schedulerService.listBatch(query);
        return success(res, result, 'Daftar batch jadwal.');
    } catch (err) {
        next(err);
    }
}

async function batchDetail(req, res, next) {
    try {
        const { id } = req.params;
        const result = await schedulerService.getBatchDetail(id);
        return success(res, result, 'Detail batch jadwal.');
    } catch (err) {
        next(err);
    }
}

async function listJadwal(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await schedulerService.listJadwal(query);
        return success(res, result, 'Daftar jadwal kuliah.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    generate,
    listBatch,
    batchDetail,
    listJadwal,
};
