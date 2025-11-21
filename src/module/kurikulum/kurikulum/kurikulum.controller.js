const { success } = require('../../../utils/response');
const service = require('./kurikulum.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listKurikulum(query);
        return success(res, result, 'Daftar kurikulum.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getKurikulum(id);
        return success(res, data, 'Detail kurikulum.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createKurikulum(body);
        return success(res, data, 'Kurikulum berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updateKurikulum(params.id, body);
        return success(res, data, 'Kurikulum berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteKurikulum(id);
        return success(res, result, 'Kurikulum berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

async function assignMatkul(req, res, next) {
    try {
        const { params, body } = req.validated;
        const result = await service.assignMatkul(params.id, body.items);
        return success(res, result, 'Mata kuliah berhasil di-assign ke kurikulum.');
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
    assignMatkul,
};
