const { success } = require('../../../utils/response');
const service = require('./penugasanMengajar.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listPenugasan(query);
        return success(res, result, 'Daftar penugasan mengajar berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getPenugasan(id);
        return success(res, data, 'Detail penugasan mengajar berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createPenugasan(body);
        return success(res, data, 'Penugasan mengajar berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updatePenugasan(params.id, body);
        return success(res, data, 'Penugasan mengajar berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function setSiap(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.setStatus(id, 'SIAP');
        return success(res, data, 'Penugasan mengajar berhasil di-set SIAP.');
    } catch (err) {
        next(err);
    }
}

async function setDraf(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.setStatus(id, 'DRAF');
        return success(res, data, 'Penugasan mengajar berhasil di-set DRAF.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deletePenugasan(id);
        return success(res, result, 'Penugasan mengajar berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    setSiap,
    setDraf,
    remove,
};
