const { success } = require('../../../utils/response');
const service = require('./ruang.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listRuang(query);
        return success(res, result, 'Daftar ruang.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getRuang(id);
        return success(res, data, 'Detail ruang.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createRuang(body);
        return success(res, data, 'Ruang berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updateRuang(params.id, body);
        return success(res, data, 'Ruang berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteRuang(id);
        return success(res, result, 'Ruang berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

async function setAktif(req, res, next) {
    try {
        const { id } = req.params;
        const { aktif } = req.body;
        const data = await service.setAktif(id, Boolean(aktif));
        return success(res, data, 'Status ruang diperbarui.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    remove,
    setAktif,
};
