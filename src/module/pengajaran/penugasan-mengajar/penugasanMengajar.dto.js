const { z } = require("zod");

const StatusPenugasanEnum = z.enum(["DRAF", "SIAP"]);

const listPenugasanQueryDto = z.object({
    query: z.object({
        prodiId: z.string().optional(),
        periodeId: z.string().optional(),
        status: StatusPenugasanEnum.optional(),
        dosenId: z.string().optional(),
        kelasId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).default(50).optional(),
    }),
});

const createPenugasanDto = z.object({
    body: z.object({
        programMatkulId: z.string().min(1),
        kelompokKelasId: z.string().min(1),
        dosenId: z.string().min(1),
        jumlahSesiPerMinggu: z.coerce.number().int().min(1),
        butuhLab: z.boolean().default(false),
        preferensiRuangJenis: z.string().optional(), // 'TEORI'/'LAB'
        status: StatusPenugasanEnum.default('DRAF').optional(),
    }),
});

const updatePenugasanDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        programMatkulId: z.string().min(1).optional(),
        kelompokKelasId: z.string().min(1).optional(),
        dosenId: z.string().optional(),
        jumlahSesiPerMinggu: z.coerce.number().int().min(1).optional(),
        butuhLab: z.boolean().optional(),
        preferensiRuangJenis: z.string().optional().nullable(),
        status: StatusPenugasanEnum.optional(),
    }),
});

module.exports = {
    listPenugasanQueryDto,
    createPenugasanDto,
    updatePenugasanDto,
};