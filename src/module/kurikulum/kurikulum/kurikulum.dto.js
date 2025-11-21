const { z } = require('zod')

const listKurikulumQueryDto = z.object({
    query: z.object({
        prodiId: z.string().optional(),
        aktif: z.enum(["true", "false"]).transform(v => v === "true").optional(),
        q: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

const createKurikulumDto = z.object({
    body: z.object({
        prodiId: z.string().min(1),
        nama: z.string().min(3),
        angkatanMulai: z.coerce.number().int().min(1900),
        angkatanSelesai: z.coerce.number().int().min(1900).optional(),
        aktif: z.boolean().optional(),
    })
})

const updateKurikulumDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        nama: z.string().min(3).optional(),
        angkatanMulai: z.coerce.number().int().min(1900).optional(),
        angkatanSelesai: z.coerce.number().int().min(1900).nullable().optional(),
        aktif: z.boolean().optional(),
    }),
});

const assignMatkulDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        items: z.array(
            z.object({
                mataKuliahId: z.string().min(1),
                semester: z.coerce.number().int().min(1).max(14),
                minimalSemester: z.coerce.number().int().min(1).max(14).optional(),
            })
        ),
    }),
});

module.exports = {
    listKurikulumQueryDto,
    createKurikulumDto,
    updateKurikulumDto,
    assignMatkulDto
}