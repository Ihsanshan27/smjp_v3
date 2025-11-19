const { success } = require('../../utils/response');
const service = require('./pengguna.service');

async function list(req, res, next) {
    try {
        const { query } = req.validated;
        const result = await service.listUsers(query);
        return success(res, result, 'Daftar pengguna.');
    } catch (err) {
        next(err);
    }
}

async function detail(req, res, next) {
    try {
        const { id } = req.params;
        const user = await service.getUser(id);
        return success(res, user, 'Detail pengguna.');
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { body } = req.validated;
        const user = await service.createUser(body);
        return success(res, user, 'Pengguna berhasil dibuat.', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { params, body } = req.validated;
        const user = await service.updateUser(params.id, body);
        return success(res, user, 'Pengguna berhasil diperbarui.');
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await service.deleteUser(id);
        return success(res, result, 'Pengguna berhasil dihapus.');
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
