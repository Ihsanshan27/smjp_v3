const { success } = require('../../../utils/response');
const service = require('./programMatkul.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listProgramMatkul(query);
        return success(res, result, 'Daftar Program Mata Kuliah berhasil diambil.');
    } catch (error) {
        next(error);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.getProgramMatkul(id);
        return success(res, result, 'Detail Program Mata Kuliah berhasil diambil.');
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const result = await service.createProgramMatkul(body);
        return success(res, result, 'Program Mata Kuliah berhasil dibuat.');
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const result = await service.updateProgramMatkul(params.id, body);
        return success(res, result, 'Program Mata Kuliah berhasil diupdate.');
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteProgramMatkul(id);
        return success(res, result, 'Program Mata Kuliah berhasil dihapus.');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    list,
    detail,
    create,
    update,
    remove
};
