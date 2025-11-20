// src/modules/master/slot-waktu/slotWaktu.dto.js
const { z } = require('zod');

const createSlotDto = z.object({
    body: z.object({
        nama: z.string().min(3),
        jamMulai: z.string().min(4),   // "07:30"
        jamSelesai: z.string().min(4),
    }),
});

const updateSlotDto = z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
        nama: z.string().min(3).optional(),
        jamMulai: z.string().min(4).optional(),
        jamSelesai: z.string().min(4).optional(),
    }),
});

module.exports = { createSlotDto, updateSlotDto };
