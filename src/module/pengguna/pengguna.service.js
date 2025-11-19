const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const repo = require('./pengguna.repository');

async function listUsers(query) {
    return repo.findMany(query);
}

async function getUser(id) {
    const user = await repo.findById(id);
    if (!user || user.deletedAt) {
        throw new AppError('Pengguna tidak ditemukan.', 404, 'USER_NOT_FOUND');
    }
    return user;
}

async function createUser(payload) {
    const existing = await repo.findByEmail(payload.email);
    if (existing && !existing.deletedAt) {
        throw new AppError('Email sudah digunakan.', 400, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const data = {
        nama: payload.nama,
        email: payload.email,
        password: passwordHash,
        peran: payload.peran,
        fakultasId: payload.fakultasId || null,
        prodiId: payload.prodiId || null,
    };

    const user = await repo.create(data);
    return user;
}

async function updateUser(id, payload) {
    const user = await repo.findById(id);
    if (!user || user.deletedAt) {
        throw new AppError('Pengguna tidak ditemukan.', 404, 'USER_NOT_FOUND');
    }

    const data = {
        ...(payload.nama ? { nama: payload.nama } : {}),
        ...(payload.peran ? { peran: payload.peran } : {}),
        fakultasId:
            payload.fakultasId !== undefined ? payload.fakultasId : user.fakultasId,
        prodiId:
            payload.prodiId !== undefined ? payload.prodiId : user.prodiId,
    };

    return repo.update(id, data);
}

async function deleteUser(id) {
    const user = await repo.findById(id);
    if (!user || user.deletedAt) {
        throw new AppError('Pengguna tidak ditemukan.', 404, 'USER_NOT_FOUND');
    }

    const userDeleted = await repo.softDelete(id);
    return userDeleted;
}

module.exports = {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
