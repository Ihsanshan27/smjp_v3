const AppError = require('../utils/appError');

function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.code,
            meta: err.meta || null,
        });
    }

    // Prisma error basic handling (optional)
    if (err.code && err.code.startsWith('P')) {
        return res.status(500).json({
            status: 'error',
            message: 'Database error',
            code: err.code,
            meta: err.meta || null,
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
}

module.exports = errorHandler;