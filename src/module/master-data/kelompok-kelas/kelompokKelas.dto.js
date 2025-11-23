const { z } = require("zod");

const listKelasQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        prodiId: z.string().optional(),
        angkatan: z.coerce.number().int().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    })
})

const createKelasDto = z.object({
    body: z.object({
        prodiId: z.string().min(1, 'Prodi ID is required'),
        kode: z.string().min(1, 'Kode is required'),
        angkatan: z.coerce.number().int().min(1, 'Angkatan is required'),
        kapasitas: z.coerce.number().int().min(1, 'Kapasitas is optional').optional(),
    })
})

const updateKelasDto = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required'),
    }),
    body: z.object({
        kode: z.string().min(1, 'Kode is required').optional(),
        angkatan: z.coerce.number().int().min(1, 'Angkatan is required').optional(),
        kapasitas: z.coerce.number().int().min(1, 'Kapasitas is required').optional().nullable(),
    }).partial()
})

module.exports = {
    listKelasQueryDto,
    createKelasDto,
    updateKelasDto
}