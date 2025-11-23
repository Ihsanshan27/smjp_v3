const { z } = require('zod');

const jenisRuangEnum = z.enum(['TEORI', 'LAB', 'LAINNYA']);

const listRuangQueryDto = z.object({
    query: z.object({
        fakultasId: z.string().optional(),
        aktif: z.coerce.boolean().optional(),
        q: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

const createRuangDto = z.object({
    body: z.object({
        fakultasId: z.string().min(1),
        kode: z.string().min(2),
        nama: z.string().min(3),
        kapasitas: z.coerce.number().int().min(1),
        jenis: jenisRuangEnum,
        lokasi: z.string().optional(),
        aktif: z.boolean().optional(),
    }),
});

const updateRuangDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        nama: z.string().min(3).optional(),
        kapasitas: z.coerce.number().int().min(1).optional(),
        jenis: jenisRuangEnum.optional(),
        lokasi: z.string().optional(),
        aktif: z.boolean().optional(),
    }).partial(),
});

module.exports = {
    listRuangQueryDto,
    createRuangDto,
    updateRuangDto,
};
