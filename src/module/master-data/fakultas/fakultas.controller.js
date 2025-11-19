// src/modules/master/fakultas/fakultas.controller.js
const { success } = require('../../../utils/response');
const service = require('./fakultas.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listFakultas(query);
        return success(res, result, 'Daftar fakultas.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getFakultas(id);
        return success(res, data, 'Detail fakultas.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createFakultas(body);
        return success(res, data, 'Fakultas berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updateFakultas(params.id, body);
        return success(res, data, 'Fakultas berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteFakultas(id);
        return success(res, result, 'Fakultas berhasil dihapus.');
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
};
