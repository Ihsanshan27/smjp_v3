const { success } = require('../../utils/response');
const service = require('./perubahanJadwal.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listPerubahan(query);
        return success(res, result, 'Daftar pengajuan perubahan jadwal berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getPerubahan(id);
        return success(res, data, 'Detail pengajuan perubahan jadwal berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const user = req.user;
        const data = await service.createPerubahan(body, user);
        return success(res, data, 'Pengajuan perubahan jadwal berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function approve(req, res, next) {
    try {
        const { params } = req.validated;
        const approverId = req.user.id;
        const data = await service.approvePerubahan(params.id, approverId);
        return success(res, data, 'Pengajuan perubahan jadwal disetujui.');
    } catch (err) {
        next(err);
    }
}

async function reject(req, res, next) {
    try {
        const { params, body } = req.validated;
        const approverId = req.user.id;
        const data = await service.rejectPerubahan(params.id, body, approverId);
        return success(res, data, 'Pengajuan perubahan jadwal ditolak.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await service.deletePerubahan(id, userId);
        return success(res, null, 'Pengajuan perubahan jadwal berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    detail,
    create,
    approve,
    reject,
    remove,
};
