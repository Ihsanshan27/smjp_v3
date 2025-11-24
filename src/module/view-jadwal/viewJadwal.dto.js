const { z } = require('zod');

// helper
const BaseViewQuery = {
    batchId: z.string().optional(),
    fakultasId: z.string().optional(),
    periodeAkademikId: z
        .string()
        .min(1, 'periodeAkademikId wajib diisi.'),
};

const viewJadwalDosenQueryDto = z.object({
    query: z.object({
        ...BaseViewQuery,
        dosenId: z.string().min(1, 'dosenId wajib diisi.'),
    }),
});

const viewJadwalKelasQueryDto = z.object({
    query: z.object({
        ...BaseViewQuery,
        kelompokKelasId: z
            .string()
            .min(1, 'kelompokKelasId wajib diisi.'),
    }),
});

const viewJadwalRuangQueryDto = z.object({
    query: z.object({
        ...BaseViewQuery,
        ruangId: z.string().min(1, 'ruangId wajib diisi.'),
    }),
});

const viewJadwalProdiQueryDto = z.object({
    query: z.object({
        ...BaseViewQuery,
        prodiId: z.string().min(1, 'prodiId wajib diisi.'),
    }),
});

module.exports = {
    viewJadwalDosenQueryDto,
    viewJadwalKelasQueryDto,
    viewJadwalRuangQueryDto,
    viewJadwalProdiQueryDto,
};
