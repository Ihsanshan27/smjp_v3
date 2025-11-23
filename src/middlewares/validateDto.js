const { ZodError } = require('zod');
const AppError = require('../utils/appError');

function validateDto(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.validated = parsed;
            next();
        } catch (err) {
            console.log('DTO ERROR: ', err);
            if (err instanceof ZodError) {
                const formatted = err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                }));

                return next(
                    new AppError('Validasi data gagal.', 400, 'VALIDATION_ERROR', formatted)
                );
            }

            return next(err);
        }
    };
}

module.exports = validateDto;
