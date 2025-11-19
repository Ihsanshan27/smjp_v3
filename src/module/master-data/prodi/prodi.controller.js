const { success } = require('../../../utils/response');
const service = require('./prodi.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listProdi(query);
        return success(res, result, 'Daftar prodi.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getProdi(id);
        return success(res, data, 'Detail prodi.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createProdi(body);
        return success(res, data, 'Prodi berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updateProdi(params.id, body);
        return success(res, data, 'Prodi berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteProdi(id);
        return success(res, result, 'Prodi berhasil dihapus.');
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
