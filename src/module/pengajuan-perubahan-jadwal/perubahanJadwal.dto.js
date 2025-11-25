const { z } = require('zod');

const StatusPerubahanEnum = z.enum(['DIAJUKAN', 'DISETUJUI', 'DITOLAK']);

const listPerubahanQueryDto = z.object({
    query: z.object({
        prodiId: z.string().optional(),
        status: StatusPerubahanEnum.optional(),
        periodeId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

const createPerubahanBodyDto = z.object({
    jadwalKuliahId: z.string().min(1, 'jadwalKuliahId wajib diisi.'),
    hariBaruId: z.string().min(1, 'hariBaruId wajib diisi.'),
    slotWaktuBaruId: z.string().min(1, 'slotWaktuBaruId wajib diisi.'),
    ruangBaruId: z.string().optional().nullable(),
    alasanPengaju: z.string().min(5, 'Alasan minimal 5 karakter.'),
});

const createPerubahanDto = z.object({
    body: createPerubahanBodyDto,
});

const approvePerubahanDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({}).optional(),
});

const rejectPerubahanDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        alasanRespon: z
            .string()
            .min(5, 'Alasan penolakan minimal 5 karakter.'),
    }).optional(),
});

module.exports = {
    listPerubahanQueryDto,
    createPerubahanDto,
    approvePerubahanDto,
    rejectPerubahanDto,
};
