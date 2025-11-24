// src/modules/pengajaran/preferensi-dosen/preferensiDosen.service.js
const AppError = require('../../../utils/appError');
const repo = require('./preferensiDosen.repository');

async function listPreferensi(query) {
    return repo.findMany(query);
}

async function getPreferensi(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Preferensi dosen tidak ditemukan.', 404, 'PREFERENSI_NOT_FOUND');
    }
    return data;
}

async function createPreferensi(payload) {
    // cek apakah kombinasi (dosenId, hariId, slotWaktuId) sudah ada
    const existing = await repo.findByUnique({
        dosenId: payload.dosenId,
        hariId: payload.hariId,
        slotWaktuId: payload.slotWaktuId,
    });

    if (existing && !existing.deletedAt) {
        throw new AppError(
            'Preferensi dengan kombinasi dosen/hari/slot sudah ada.',
            400,
            'PREFERENSI_EXISTS'
        );
    }

    // create record baru
    return repo.create({
        dosenId: payload.dosenId,
        hariId: payload.hariId,
        slotWaktuId: payload.slotWaktuId,
        bolehMengajar: payload.bolehMengajar ?? true,
        prioritas: payload.prioritas ?? null,
    });
}

async function updatePreferensi(id, payload) {
    const old = await repo.findById(id);
    if (!old || old.deletedAt) {
        throw new AppError('Preferensi dosen tidak ditemukan.', 404, 'PREFERENSI_NOT_FOUND');
    }

    // Hitung combination KEY baru
    const newDosenId = payload.dosenId ?? old.dosenId;
    const newHariId = payload.hariId ?? old.hariId;
    const newSlotId = payload.slotWaktuId ?? old.slotWaktuId;

    // Cek apakah kombinasi baru sudah ada
    const conflict = await repo.findByUnique({
        dosenId: newDosenId,
        hariId: newHariId,
        slotWaktuId: newSlotId,
    });

    if (conflict && conflict.id !== id) {
        throw new AppError(
            'Preferensi dengan kombinasi dosen/hari/slot sudah ada.',
            400,
            'PREFERENSI_EXISTS'
        );
    }

    // Update aman
    return repo.update(id, {
        dosenId: newDosenId,
        hariId: newHariId,
        slotWaktuId: newSlotId,
        ...(payload.bolehMengajar !== undefined
            ? { bolehMengajar: payload.bolehMengajar }
            : {}),
        ...(payload.prioritas !== undefined
            ? { prioritas: payload.prioritas }
            : {}),
    });
}

async function deletePreferensi(id) {
    const data = await repo.findById(id);
    if (!data || data.deletedAt) {
        throw new AppError('Preferensi dosen tidak ditemukan.', 404, 'PREFERENSI_NOT_FOUND');
    }

    const deleted = await repo.softDelete(id);
    return deleted;
}

module.exports = {
    listPreferensi,
    getPreferensi,
    createPreferensi,
    updatePreferensi,
    deletePreferensi,
};
