const AppError = require('../../../utils/appError');
const repo = require('./programMatkul.repository');

async function listProgramMatkul(query) {
    return await repo.findMany(query);
}

async function getProgramMatkul(id) {
    const data = await repo.findById(id);

    if (!data || data.deletedAt) {
        throw new AppError('Program mata kuliah tidak ditemukan.', 404, 'PROGRAM_MATKUL_NOT_FOUND');
    }

    return data;
}

async function createProgramMatkul(payload) {
    // cek duplicate by unique combination
    const existing = await repo.findByUnique(payload);

    if (existing && !existing.deletedAt) {
        throw new AppError('Program mata kuliah sudah ada.', 400, 'PROGRAM_MATKUL_EXISTS');
    }

    // buat baru
    return await repo.create({
        prodiId: payload.prodiId,
        periodeId: payload.periodeId,
        mataKuliahId: payload.mataKuliahId,
        kurikulumId: payload.kurikulumId ?? null,
        jumlahKelompokKelas: payload.jumlahKelompokKelas
    });
}

async function updateProgramMatkul(id, payload) {
    const data = await repo.findById(id);

    if (!data || data.deletedAt) {
        throw new AppError('Program mata kuliah tidak ditemukan.', 404, 'PROGRAM_MATKUL_NOT_FOUND');
    }

    return repo.update(id, {
        ...(payload.prodiId ? { prodiId: payload.prodiId } : {}),
        ...(payload.periodeId ? { periodeId: payload.periodeId } : {}),
        ...(payload.mataKuliahId ? { mataKuliahId: payload.mataKuliahId } : {}),
        ...(payload.kurikulumId ? { kurikulumId: payload.kurikulumId } : {}),
        ...(payload.jumlahKelompokKelas
            ? { jumlahKelompokKelas: payload.jumlahKelompokKelas }
            : {}),
    });
}

async function deleteProgramMatkul(id) {
    const data = await repo.findById(id);

    if (!data || data.deletedAt) {
        throw new AppError('Program mata kuliah tidak ditemukan.', 404, 'PROGRAM_MATKUL_NOT_FOUND');
    }

    return await repo.softDelete(id);
}

module.exports = {
    listProgramMatkul,
    getProgramMatkul,
    createProgramMatkul,
    updateProgramMatkul,
    deleteProgramMatkul,
};
