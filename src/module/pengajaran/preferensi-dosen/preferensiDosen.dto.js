const { z } = require('zod');

const listPreferensiQueryDto = z.object({
    query: z.object({
        dosenId: z.string().optional(),
        hariId: z.string().optional(),
        slotWaktuId: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(200).default(50).optional(),
    })
})

const createPreferensiDto = z.object({
    body: z.object({
        dosenId: z.string().min(1),
        hariId: z.string().min(1),
        slotWaktuId: z.string().min(1),
        bolehMengajar: z.boolean().default(true).optional(),
        prioritas: z.coerce.number().int().min(1).optional().nullable(),
    })
})

const updatePreferensiDto = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z.object({
        dosenId: z.string().min(1).optional(),
        hariId: z.string().min(1).optional(),
        slotWaktuId: z.string().min(1).optional(),
        bolehMengajar: z.boolean().default(true).optional(),
        prioritas: z.coerce.number().int().min(1).optional().nullable(),
    }).partial()
})

module.exports = {
    listPreferensiQueryDto,
    createPreferensiDto,
    updatePreferensiDto,
}