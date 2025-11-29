const { z } = require('zod');

const StatusBatchEnum = z.enum([
    'SIAP',
    'FINAL',
]);

const generateJadwalBodyDto = z.object({
    body: z.object({
        fakultasId: z.string(),
        periodeAkademikId: z.string(),
        dryRun: z.coerce.boolean().default(false).optional(),
        ukuranPopulasi: z.coerce
            .number()
            .int()
            .min(10)
            .max(200)
            .default(25)
            .optional(),
        jumlahGenerasi: z.coerce
            .number()
            .int()
            .min(10)
            .max(500)
            .default(50)
            .optional(),
        namaBatch: z.string().optional(), // optional custom name
    })
});


const listBatchQueryDto = z.object({
    query: z.object({
        fakultasId: z.string().optional(),
        periodeAkademikId: z.string().optional(),
        status: StatusBatchEnum.optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
    }),
});

const listJadwalQueryDto = z.object({
    query: z.object({
        batchId: z.string().optional(),
        fakultasId: z.string().optional(),
        periodeAkademikId: z.string().optional(),
        prodiId: z.string().optional(),
        dosenId: z.string().optional(),
        kelompokKelasId: z.string().optional(),
        hariId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(200).default(100).optional(),
    }),
});

const listGaKromosomByBatchDto = z.object({
    query: z.object({
        id: z.string().optional(),
        batchId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(20).optional(),
        isBest: z
            .union([z.string(), z.boolean()])
            .optional()
            .transform((val) => {
                if (val === undefined) return undefined;
                if (typeof val === 'boolean') return val;
                return val === 'true';
            }),
    }),
});

const getGaKromosomDetailDto = z.object({
    params: z.object({
        id: z.string(),
    }),
});

const updateBatchStatusDto = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        status: StatusBatchEnum,
    })
});

module.exports = {
    generateJadwalBodyDto,
    listBatchQueryDto,
    listJadwalQueryDto,
    listGaKromosomByBatchDto,
    getGaKromosomDetailDto,
    updateBatchStatusDto,
};