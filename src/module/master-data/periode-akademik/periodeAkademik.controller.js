const { success } = require('../../../utils/response');
const service = require('./periodeAkademik.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listPeriode(query);
        return success(res, result, 'Daftar periode akademik.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.getPeriode(id);
        return success(res, data, 'Detail periode akademik.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const data = await service.createPeriode(body);
        return success(res, data, 'Periode akademik berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const data = await service.updatePeriode(params.id, body);
        return success(res, data, 'Periode akademik berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const deleted = await service.deletePeriode(id);
        return success(res, deleted, 'Periode akademik berhasil dihapus.');
    } catch (err) {
        next(err);
    }
}

async function setAktif(req, res, next) {
    try {
        const { id } = req.params;
        const data = await service.setPeriodeAktif(id);
        return success(res, data, 'Periode akademik di-set aktif.');
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
