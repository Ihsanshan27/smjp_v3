const { z } = require('zod');

const ParuhEnum = z.enum(['GANJIL', 'GENAP']);

const listPeriodeQueryDto = z.object({
    query: z.object({
        q: z.string().optional(),
        fakultasId: z.string().optional(),
        paruh: ParuhEnum.optional(),
        aktif: z.enum(["true", "false"]).transform(v => v === "true").optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

const createPeriodeDto = z.object({
    body: z.object({
        fakultasId: z.string().min(1, 'fakultasId wajib diisi.'),
        nama: z.string().min(5, 'Nama periode minimal 5 karakter. Contoh: "2025/2026 Ganjil".'),
        paruh: ParuhEnum,
        tahunMulai: z.coerce.number().int().min(1900, 'tahunMulai tidak valid.'),
        tahunSelesai: z.coerce.number().int().min(1900, 'tahunSelesai tidak valid.'),
        tanggalMulai: z.coerce.date(),
        tanggalSelesai: z.coerce.date(),
        aktif: z.boolean().optional(),
    }),
});

const updatePeriodeDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        nama: z.string().min(5).optional(),
        paruh: ParuhEnum.optional(),
        tahunMulai: z.coerce.number().int().min(1900).optional(),
        tahunSelesai: z.coerce.number().int().min(1900).optional(),
        tanggalMulai: z.coerce.date().optional(),
        tanggalSelesai: z.coerce.date().optional(),
        aktif: z.boolean().optional(),
    }),
});

module.exports = {
    listPeriodeQueryDto,
    createPeriodeDto,
    updatePeriodeDto,
};
