const AppError = require('../../utils/appError');
const schedulerRepository = require('./scheduler.repository');
const { jalankanGA } = require('./gaEngine');

async function generateJadwalOtomatis({
    fakultasId,
    periodeAkademikId,
    dryRun = false,
    ukuranPopulasi = 25,
    jumlahGenerasi = 50,
    namaBatch,
    dibuatOlehId,
}) {
    // 1. ambil penugasan SIAP
    const penugasanMengajarList = await schedulerRepository.getPenugasanMengajarSiap({
        fakultasId,
        periodeAkademikId,
    });

    if (penugasanMengajarList.length === 0) {
        throw new AppError(
            'Tidak ada penugasan mengajar berstatus SIAP untuk digenerate.',
            400,
            'NO_PENUGASAN_MENGAJAR_SIAP'
        );
    }

    // 2. ambil master data jadwal
    const [ruangAktifList, hariList, slotList] = await Promise.all([
        schedulerRepository.getRuangAktifByFakultas(fakultasId),
        schedulerRepository.getHariList(),
        schedulerRepository.getSlotList(),
    ]);

    if (ruangAktifList.length === 0) {
        throw new AppError(
            'Tidak ada ruang aktif pada fakultas ini.',
            400,
            'RUANG_AKTIF_TIDAK_DITEMUKAN'
        );
    }

    if (hariList.length === 0 || slotList.length === 0) {
        throw new AppError(
            'Master data hari/slot waktu belum lengkap.',
            400,
            'MASTER_HARI_SLOT_KOSONG'
        );
    }

    // 3. ambil preferensi dosen
    const dosenIds = [
        ...new Set(penugasanMengajarList.map((p) => p.dosenId).filter(Boolean)),
    ];
    const preferensiList = await schedulerRepository.getPreferensiDosenMap(dosenIds);

    // 4. jalankan GA
    const hasilGA = jalankanGA({
        penugasanMengajarList,
        hariList,
        slotList,
        ruangList: ruangAktifList,
        preferensiList,
        ukuranPopulasi,
        jumlahGenerasi,
    });

    const { kromosomTerbaik, fitnessTerbaik, penaltyTerbaik, totalGenerasi } =
        hasilGA;

    const stats = {
        fitnessTerbaik,
        penaltyTerbaik,
        totalGenerasi,
    };

    if (dryRun) {
        // return preview saja, tidak simpan DB
        return {
            mode: 'DRY_RUN',
            stats,
            jadwalPreview: kromosomTerbaik,
        };
    }

    // 5. simpan batch + jadwal
    const batch = await schedulerRepository.simpanHasilBatch({
        fakultasId,
        periodeAkademikId,
        namaBatch,
        kromosomTerbaik,
        stats,
        dibuatOlehId,
        ukuranPopulasi,
        jumlahGenerasi: totalGenerasi,
    });

    await schedulerRepository.logFinalGaForBatch({
        batchId: batch.id,
        generasi: totalGenerasi,
        fitness: fitnessTerbaik,
        kromosomTerbaik,
    });

    return {
        mode: 'SAVE',
        stats: {
            ...stats,
            ukuranPopulasi,
        },
        batchId: batch.id,
    };
}

async function listBatch(query) {
    return schedulerRepository.listBatch(query);
}

async function getBatchDetail(id) {
    const batch = await schedulerRepository.getBatchById(id);
    if (!batch || batch.deletedAt) {
        throw new AppError('Batch jadwal tidak ditemukan.', 404, 'BATCH_NOT_FOUND');
    }
    return batch;
}

async function listJadwal(query) {
    return schedulerRepository.listJadwalWithFilter(query);
}

module.exports = {
    generateJadwalOtomatis,
    listBatch,
    getBatchDetail,
    listJadwal,
};
