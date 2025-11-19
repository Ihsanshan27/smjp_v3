const { z } = require('zod');

const listFakultasQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).optional(),
    })
})

const createFakultasDto = z.object({
    body: z.object({
        kode: z.string().min(2, 'Kode fakultas minimal 2 karakter'),
        nama: z.string().min(2, 'Nama fakultas minimal 2 karakter'),
    })
})

const updateFakultasDto = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        kode: z.string().min(2, 'Kode fakultas minimal 2 karakter').optional(),
        nama: z.string().min(2, 'Nama fakultas minimal 2 karakter').optional(),
    })
})

module.exports = {
    listFakultasQueryDto,
    createFakultasDto,
    updateFakultasDto
}