const { z } = require('zod');

const listDosenQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        fakultasId: z.string().optional(),
        prodiId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    })
})

const createDosenDto = z.object({
    body: z.object({
        penggunaId: z.string().min(1, 'penggunaId wajib diisi.').optional(),  // user DOSEN yang sudah ada
        nama: z.string().min(1, 'nama wajib diisi.'),
        nidn: z.string().optional(),
        fakultasId: z.string().optional(),
        prodiId: z.string().optional(),
        bebanMengajarMaks: z.coerce.number().int().min(1).optional(),
    }),
})

const updateDosenDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        penggunaId: z.string().min(1, 'penggunaId wajib diisi.').optional(),
        nama: z.string().min(1, 'nama wajib diisi.').optional(),
        nidn: z.string().optional(),
        prodiId: z.string().optional(),
        bebanMengajarMaks: z.coerce.number().int().min(1).optional(),
    }).partial(),
})

module.exports = {
    listDosenQueryDto,
    createDosenDto,
    updateDosenDto,
}