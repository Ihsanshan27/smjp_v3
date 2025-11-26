const schedulerRepository = require('../scheduler/scheduler.repository');

async function getJadwalForExport({ batchId, periodeAkademikId, fakultasId, prodiId }) {
    const { items } = await schedulerRepository.listJadwalWithFilter({
        batchId: batchId || undefined,
        periodeAkademikId: periodeAkademikId || undefined,
        fakultasId: fakultasId || undefined,
        prodiId: prodiId || undefined,
        page: 1,
        pageSize: 5000,
    });

    items.sort((a, b) => {
        const urutA = a.hari?.urutan ?? 0;
        const urutB = b.hari?.urutan ?? 0;
        if (urutA !== urutB) return urutA - urutB;

        const timeA = a.slotWaktu?.jamMulai ? new Date(a.slotWaktu.jamMulai).getTime() : 0;
        const timeB = b.slotWaktu?.jamMulai ? new Date(b.slotWaktu.jamMulai).getTime() : 0;
        return timeA - timeB;
    });

    return items;
}

function toCsvLine(fields) {
    return fields
        .map((f) => {
            if (f == null) return '';
            const s = String(f);
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        })
        .join(',');
}

async function exportJadwalCsvData(filters) {
    const items = await getJadwalForExport(filters);

    const header = [
        'Hari',
        'Jam Mulai',
        'Jam Selesai',
        'Ruang',
        'Prodi',
        'Kelas',
        'Matkul Kode',
        'Matkul Nama',
        'Dosen',
        'Periode',
        'BatchId',
    ];

    const lines = [toCsvLine(header)];

    for (const j of items) {
        const row = [
            j.hari?.nama,
            j.slotWaktu?.jamMulai ? new Date(j.slotWaktu.jamMulai).toTimeString().slice(0, 5) : '',
            j.slotWaktu?.jamSelesai ? new Date(j.slotWaktu.jamSelesai).toTimeString().slice(0, 5) : '',
            j.ruang ? `${j.ruang.kode} - ${j.ruang.nama}` : '',
            j.penugasanMengajar?.programMatkul?.prodi?.nama,
            j.penugasanMengajar?.kelompokKelas
                ? `${j.penugasanMengajar.kelompokKelas.kode} (${j.penugasanMengajar.kelompokKelas.angkatan})`
                : '',
            j.penugasanMengajar?.programMatkul?.mataKuliah?.kode,
            j.penugasanMengajar?.programMatkul?.mataKuliah?.nama,
            j.penugasanMengajar?.dosen?.pengguna?.nama,
            j.penugasanMengajar?.programMatkul?.periode?.nama,
            j.batchId,
        ];
        lines.push(toCsvLine(row));
    }

    return lines.join('\n');
}

module.exports = {
    getJadwalForExport,
    exportJadwalCsvData,
};
