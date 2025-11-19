const { z } = require('zod');

const listProdiQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        fakultasId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    })
})

const createProdiDto = z.object({
    body: z.object({
        fakultasId: z.string().min(1, 'fakultasId wajib diisi.'),
        kode: z.string().min(2),
        nama: z.string().min(3),
        jenjang: z.string().min(1),
    }),
});

const updateProdiDto = z.object({
    params: z.object({
        id: z.string().min(1, 'id wajib diisi.'),
    }),
    body: z.object({
        kode: z.string().min(2).optional(),
        nama: z.string().min(3).optional(),
        jenjang: z.string().min(1).optional(),
    }),
})

module.exports = {
    listProdiQueryDto,
    createProdiDto,
    updateProdiDto,
}