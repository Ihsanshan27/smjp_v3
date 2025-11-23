const { success } = require('../../../utils/response');
const service = require('./dosen.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated
        const result = await service.listDosen(query)
        return success(res, result, 'Daftar dosen berhasil diambil.')
    } catch (error) {
        next(error);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params
        const data = await service.getDosen(id)
        return success(res, data, 'Detail dosen berhasil diambil.')
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated
        const data = await service.createDosen(body)
        return success(res, data, 'Dosen berhasil dibuat.', 201)
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated
        const data = await service.updateDosen(params.id, body)
        return success(res, data, 'Dosen berhasil diperbarui.')
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params
        const result = await service.deleteDosen(id)
        return success(res, result, 'Dosen berhasil dihapus.')
    } catch (error) {
        next(error);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    remove,
}