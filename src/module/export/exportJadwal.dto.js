const { z } = require('zod');

const baseExportQuery = {
    batchId: z.string().optional(),
    fakultasId: z.string().optional(),
    periodeAkademikId: z.string().optional(),
    prodiId: z.string().optional(),
}

const exportJadwalCsvQueryDto = z.object({
    query: z.object({
        ...baseExportQuery,
    }),
});

const exportJadwalPdfQueryDto = z.object({
    query: z.object({
        ...baseExportQuery,
    }),
});

module.exports = {
    exportJadwalCsvQueryDto,
    exportJadwalPdfQueryDto,
};
