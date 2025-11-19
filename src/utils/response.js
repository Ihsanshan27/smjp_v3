function success(res, data = null, message = 'OK', statusCode = 200) {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
}

function fail(res, message = 'Bad Request', statusCode = 400, code = 'BAD_REQUEST', errors = null) {
    return res.status(statusCode).json({
        status: 'fail',
        message,
        code,
        errors,
    });
}

module.exports = { success, fail };
