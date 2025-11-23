const { z } = require('zod');

const listMatkulQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional()
    })
})

const createMatkulDto = z.object({
    body: z.object({
        kode: z.string().min(1, 'Kode mata kuliah harus diisi'),
        nama: z.string().min(3, 'Nama mata kuliah harus diisi minimal 3 karakter'),
        sks: z.coerce.number().int().min(0, 'SKS harus berupa angka minimal 0'),
        jenis: z.string().min(3, 'Jenis mata kuliah harus diisi minimal 3 karakter')
    })
})

const updateMatkulDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        kode: z.string().min(2).optional(),
        nama: z.string().min(3).optional(),
        sksTeori: z.coerce.number().int().min(0).optional(),
        jenis: z.string().min(3).optional(),
    }).partial(),
});

module.exports = {
    listMatkulQueryDto,
    createMatkulDto,
    updateMatkulDto
}