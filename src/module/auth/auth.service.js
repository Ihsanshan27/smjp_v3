const prisma = require('../../config/prisma')
const AppError = require('../../utils/appError')
const { signToken, comparePassword } = require('./auth.repository')

async function login({ email, password }) {
    const user = await prisma.pengguna.findUnique({
        where: { email },
        include: {
            fakultas: true,
            prodi: true
        }
    })

    if (!user || user.deletedAt) {
        throw new AppError('Email atau password salah', 401, 'INVALID_CREDENTIALS')
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
        throw new AppError('Email atau password salah', 401, 'INVALID_CREDENTIALS')
    }

    const payload = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        peran: user.peran,
        fakultasId: user.fakultasId,
        prodiId: user.prodiId,
    };

    const token = signToken(payload)
    return {
        token,
        user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            peran: user.peran,
            fakultasId: user.fakultasId,
            prodiId: user.prodiId,
            fakultasNama: user.fakultas?.nama || null,
            prodiNama: user.prodi?.nama || null,
        }
    }
}

async function getProfile(userId) {
    const user = await prisma.pengguna.findUnique({
        where: { id: userId },
        include: {
            fakultas: true,
            prodi: true
        }
    })

    if (!user || user.deletedAt) {
        throw new AppError('Pengguna tidak ditemukan', 404, 'USER_NOT_FOUND')
    }
    return {
        id: user.id,
        nama: user.nama,
        email: user.email,
        peran: user.peran,
        fakultasId: user.fakultasId,
        prodiId: user.prodiId,
        fakultasNama: user.fakultas?.nama || null,
        prodiNama: user.prodi?.nama || null,
    }
}

module.exports = {
    login,
    getProfile
}