const { success } = require('../../../utils/response');
const service = require('./preferensiDosen.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listPreferensi(query);
        return success(res, result, 'Daftar preferensi dosen berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getPreferensi(id);
        return success(res, data, 'Detail preferensi dosen berhasil diambil.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createPreferensi(body);
        return success(res, data, 'Preferensi dosen berhasil dibuat.');
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updatePreferensi(params.id, body);
        return success(res, data, 'Preferensi dosen berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deletePreferensi(id);
        return success(res, result, 'Preferensi dosen berhasil dihapus.');
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
