const { success } = require('../../utils/response')
const authService = require('./auth.service')

async function login(req, res, next) {
    try {
        const { body } = req.validated
        const result = await authService.login(body)
        success(res, result, 'Login berhasil')
    } catch (err) {
        next(err)
    }
}

async function getProfile(req, res, next) {
    try {
        const result = await authService.getProfile(req.user.id)
        return success(res, result, 'Profil pengguna berhasil diambil')
    } catch (err) {
        next(err)
    }
}

module.exports = {
    login,
    getProfile,
}