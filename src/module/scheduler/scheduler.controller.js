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

async function listGaKromosomByBatch(req, res, next) {
    try {
        const { query } = req.validated;

        const result = await schedulerService.listGaKromosomByBatchService({
            id: query.id ?? undefined, // opsional
            batchId: query.batchId ?? undefined, // opsional
            page: query.page,
            pageSize: query.pageSize,
            isBest: query.isBest,
        });

        return success(res, result, 'Daftar kromosom GA.');
    } catch (err) {
        next(err);
    }
}

async function getGaKromosomDetail(req, res, next) {
    try {
        const { params } = req.validated;
        const result = await schedulerService.getGaKromosomDetailService(params.id);
        return success(res, result, 'Detail kromosom GA.');
    } catch (err) {
        next(err);
    }
}

async function setBatchFinal(req, res, next) {
    try {
        const { id } = req.params;
        const data = await schedulerService.setBatchFinalService(id);
        return success(res, data, 'Batch jadwal diset sebagai FINAL (aktif).');
    } catch (err) {
        next(err);
    }
}

async function deleteBatch(req, res, next) {
    try {
        const { id } = req.params;
        const deleted = await schedulerService.deleteBatch(id);
        return success(res, deleted, 'Batch jadwal dihapus.');
    } catch (err) {
        next(err);
    }
}

async function updateBatchStatus(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await schedulerService.updateBatchStatus(params.id, body.status);
        return success(res, data, 'Status batch jadwal diperbarui.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    generate,
    listBatch,
    batchDetail,
    listJadwal,
    listGaKromosomByBatch,
    getGaKromosomDetail,
    setBatchFinal,
    deleteBatch,
    updateBatchStatus,
};
