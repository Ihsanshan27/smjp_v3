const { z } = require('zod');

const PeranEnum = z.enum(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN']);

const createUserDto = z.object({
    body: z.object({
        nama: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        peran: PeranEnum,
        fakultasId: z.string().optional(),
        prodiId: z.string().optional(),
    }),
});

const updateUserDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        nama: z.string().min(3).optional(),
        peran: PeranEnum.optional(),
        fakultasId: z.string().optional().nullable(),
        prodiId: z.string().optional().nullable(),
    }).partial(),
});

const listUserQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        peran: PeranEnum.optional(),
        fakultasId: z.string().optional(),
        prodiId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

module.exports = {
    createUserDto,
    updateUserDto,
    listUserQueryDto,
};
