const { success } = require("../../../utils/response");
const service = require("./kelompokKelas.service");

async function list(req, res, next) {
    try {
        const { query } = req.validated
        const result = await service.listKelas(query)
        success(res, result, 'Data Kelompok Kelas berhasil diambil.')
    } catch (error) {
        next(error);
    }
}

async function get(req, res, next) {
    try {
        const { id } = req.params
        const result = await service.getKelas(id)
        success(res, result, 'Data Kelompok Kelas berhasil diambil.')
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated
        const data = await service.createKelas(body)
        success(res, data, 'Data Kelompok Kelas berhasil dibuat.')
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated
        const data = await service.updateKelas(params.id, body)
        success(res, data, 'Data Kelompok Kelas berhasil diperbarui.')
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params
        const remove = await service.deleteKelas(id)
        success(res, remove, 'Data Kelompok Kelas berhasil dihapus.')
    } catch (error) {
        next(error);
    }
}

module.exports = {
    list,
    get,
    create,
    update,
    remove
}