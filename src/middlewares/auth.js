const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('../utils/appError');

function auth(req, res, next) {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
        return next(new AppError('Unauthorized. Token tidak ditemukan.', 401, 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret);

        req.user = {
            id: payload.id,
            nama: payload.nama,
            email: payload.email,
            peran: payload.peran,
            fakultasId: payload.fakultasId || null,
            prodiId: payload.prodiId || null,
        };

        next();
    } catch (err) {
        return next(new AppError('Token tidak valid atau kadaluarsa.', 401, 'TOKEN_INVALID'));
    }
}

function role(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized.', 401, 'UNAUTHORIZED'));
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.peran)) {
            return next(new AppError('Forbidden. Akses ditolak.', 403, 'FORBIDDEN'));
        }

        next();
    };
}

module.exports = { auth, role };
