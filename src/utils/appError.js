class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', meta = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.meta = meta;
    }
}

module.exports = AppError;