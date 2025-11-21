const { success } = require('../../../utils/response')
const matkulService = require('./mataKuliah.service')

async function list(req, res, next) {
    try {
        const { query } = req.validated
        const result = await matkulService.listMatkul(query)
        return success(res, result, 'List mata kuliah berhasil diambil')
    } catch (err) {
        next(err)
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params
        const result = await matkulService.getMatkul(id)
        return success(res, result, 'Detail mata kuliah berhasil diambil')
    } catch (err) {
        next(err)
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated
        const result = await matkulService.createMatkul(body)
        return success(res, result, 'Mata kuliah berhasil dibuat')
    } catch (err) {
        next(err)
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await matkulService.updateMatkul(params.id, body);
        return success(res, data, 'Mata kuliah berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await matkulService.deleteMatkul(id);
        return success(res, result, 'Mata kuliah berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    remove
}