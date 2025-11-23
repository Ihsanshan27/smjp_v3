const { z } = require('zod');

const listProgramMatkulQueryDto = z.object({
    query: z.object({
        prodiId: z.string().optional(),
        periodeId: z.string().optional(),
        q: z.string().optional(), // nama/kode matkul
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(50).optional()
    })
})

const createProgramMatkulDto = z.object({
    body: z.object({
        prodiId: z.string().min(1),
        periodeId: z.string().min(1),
        mataKuliahId: z.string().min(1),
        kurikulumId: z.string().optional(),
        jumlahKelompokKelas: z.coerce.number().int().min(1),
    })
})

const updateProgramMatkulDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        prodiId: z.string().min(1).optional(),
        periodeId: z.string().min(1).optional(),
        mataKuliahId: z.string().min(1).optional(),
        kurikulumId: z.string().optional(),
        jumlahKelompokKelas: z.coerce.number().int().min(1).optional(),
    }).partial(),
})

module.exports = {
    listProgramMatkulQueryDto,
    createProgramMatkulDto,
    updateProgramMatkulDto
}