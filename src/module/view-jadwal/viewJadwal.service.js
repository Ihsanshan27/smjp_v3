const schedulerRepository = require('../scheduler/scheduler.repository');

// Grouping helper
function groupByHariAndSlot(items) {
    const hariMap = new Map();

    for (const j of items) {
        const hId = j.hariId;
        if (!hariMap.has(hId)) {
            hariMap.set(hId, {
                id: j.hari.id,
                nama: j.hari.nama,
                urutan: j.hari.urutan,
                slots: [],
            });
        }

        const hariData = hariMap.get(hId);
        hariData.slots.push({
            slotId: j.slotWaktuId,
            jamMulai: j.slotWaktu.jamMulai,
            jamSelesai: j.slotWaktu.jamSelesai,
            ruang: j.ruang
                ? {
                    id: j.ruang.id,
                    kode: j.ruang.kode,
                    nama: j.ruang.nama,
                    jenis: j.ruang.jenis,
                }
                : null,
            matkul: j.penugasanMengajar?.programMatkul?.mataKuliah
                ? {
                    id: j.penugasanMengajar.programMatkul.mataKuliah.id,
                    kode: j.penugasanMengajar.programMatkul.mataKuliah.kode,
                    nama: j.penugasanMengajar.programMatkul.mataKuliah.nama,
                    sksTotal:
                        j.penugasanMengajar.programMatkul.mataKuliah.sksTotal ?? null,
                }
                : null,
            prodi: j.penugasanMengajar?.programMatkul?.prodi
                ? {
                    id: j.penugasanMengajar.programMatkul.prodi.id,
                    kode: j.penugasanMengajar.programMatkul.prodi.kode,
                    nama: j.penugasanMengajar.programMatkul.prodi.nama,
                }
                : null,
            periode: j.penugasanMengajar?.programMatkul?.periode
                ? {
                    id: j.penugasanMengajar.programMatkul.periode.id,
                    nama: j.penugasanMengajar.programMatkul.periode.nama,
                }
                : null,
            dosen: j.penugasanMengajar?.dosen
                ? {
                    id: j.penugasanMengajar.dosen.id,
                    nama: j.penugasanMengajar.dosen.pengguna?.nama ??
                        j.penugasanMengajar.dosen.nama,
                    nidn: j.penugasanMengajar.dosen.nidn,
                }
                : null,
            kelas: j.penugasanMengajar?.kelompokKelas
                ? {
                    id: j.penugasanMengajar.kelompokKelas.id,
                    kode: j.penugasanMengajar.kelompokKelas.kode,
                    angkatan: j.penugasanMengajar.kelompokKelas.angkatan,
                }
                : null,
            batchId: j.batchId,
        });
    }

    // sort hari & slot
    const hariArr = Array.from(hariMap.values());
    hariArr.sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
    hariArr.forEach((h) => {
        h.slots.sort(
            (a, b) =>
                new Date(a.jamMulai).getTime() - new Date(b.jamMulai).getTime()
        );
    });

    return hariArr;
}

// ===== DOSEN =====
async function getJadwalDosen({
    batchId,
    fakultasId,
    periodeAkademikId,
    dosenId,
}) {
    const { items } = await schedulerRepository.listJadwalWithFilter({
        batchId,
        fakultasId,
        periodeAkademikId,
        dosenId,
        page: 1,
        pageSize: 500,
    });

    const hari = groupByHariAndSlot(items);
    const first = items[0];

    const meta = {
        dosen: first?.penugasanMengajar?.dosen
            ? {
                id: first.penugasanMengajar.dosen.id,
                nama: first.penugasanMengajar.dosen.pengguna?.nama ??
                    first.penugasanMengajar.dosen.nama,
                nidn: first.penugasanMengajar.dosen.nidn,
            }
            : null,
        periode:
            first?.penugasanMengajar?.programMatkul?.periode != null
                ? {
                    id: first.penugasanMengajar.programMatkul.periode.id,
                    nama: first.penugasanMengajar.programMatkul.periode.nama,
                }
                : null,
        fakultas:
            first?.batch?.fakultas != null
                ? {
                    id: first.batch.fakultas.id,
                    kode: first.batch.fakultas.kode,
                    nama: first.batch.fakultas.nama,
                }
                : null,
    };

    return {
        type: 'DOSEN',
        meta,
        hari,
        totalItem: items.length,
    };
}

// ===== KELAS =====
async function getJadwalKelas({
    batchId,
    fakultasId,
    periodeAkademikId,
    kelompokKelasId,
}) {
    const { items } = await schedulerRepository.listJadwalWithFilter({
        batchId,
        fakultasId,
        periodeAkademikId,
        kelompokKelasId,
        page: 1,
        pageSize: 500,
    });

    const hari = groupByHariAndSlot(items);
    const first = items[0];

    const meta = {
        kelas: first?.penugasanMengajar?.kelompokKelas
            ? {
                id: first.penugasanMengajar.kelompokKelas.id,
                kode: first.penugasanMengajar.kelompokKelas.kode,
                angkatan: first.penugasanMengajar.kelompokKelas.angkatan,
            }
            : null,
        prodi:
            first?.penugasanMengajar?.kelompokKelas?.prodi != null
                ? {
                    id: first.penugasanMengajar.kelompokKelas.prodi.id,
                    kode: first.penugasanMengajar.kelompokKelas.prodi.kode,
                    nama: first.penugasanMengajar.kelompokKelas.prodi.nama,
                }
                : null,
        periode:
            first?.penugasanMengajar?.programMatkul?.periode != null
                ? {
                    id: first.penugasanMengajar.programMatkul.periode.id,
                    nama: first.penugasanMengajar.programMatkul.periode.nama,
                }
                : null,
    };

    return {
        type: 'KELAS',
        meta,
        hari,
        totalItem: items.length,
    };
}

// ===== RUANG =====
async function getJadwalRuang({
    batchId,
    fakultasId,
    periodeAkademikId,
    ruangId,
}) {
    // filter by ruangId di level JadwalKuliah
    const { items } = await schedulerRepository.listJadwalWithFilter({
        batchId,
        fakultasId,
        periodeAkademikId,
        page: 1,
        pageSize: 500,
    });

    const filtered = items.filter((j) => j.ruangId === ruangId);
    const hari = groupByHariAndSlot(filtered);
    const first = filtered[0];

    const meta = {
        ruang: first?.ruang
            ? {
                id: first.ruang.id,
                kode: first.ruang.kode,
                nama: first.ruang.nama,
                jenis: first.ruang.jenis,
            }
            : null,
        fakultas:
            first?.ruang?.fakultas != null
                ? {
                    id: first.ruang.fakultas.id,
                    kode: first.ruang.fakultas.kode,
                    nama: first.ruang.fakultas.nama,
                }
                : null,
        periode:
            first?.penugasanMengajar?.programMatkul?.periode != null
                ? {
                    id: first.penugasanMengajar.programMatkul.periode.id,
                    nama: first.penugasanMengajar.programMatkul.periode.nama,
                }
                : null,
    };

    return {
        type: 'RUANG',
        meta,
        hari,
        totalItem: filtered.length,
    };
}

// ===== PRODI =====
async function getJadwalProdi({
    batchId,
    fakultasId,
    periodeAkademikId,
    prodiId,
}) {
    const { items } = await schedulerRepository.listJadwalWithFilter({
        batchId,
        fakultasId,
        periodeAkademikId,
        prodiId,
        page: 1,
        pageSize: 1000,
    });

    const hari = groupByHariAndSlot(items);
    const first = items[0];

    const meta = {
        prodi:
            first?.penugasanMengajar?.programMatkul?.prodi != null
                ? {
                    id: first.penugasanMengajar.programMatkul.prodi.id,
                    kode: first.penugasanMengajar.programMatkul.prodi.kode,
                    nama: first.penugasanMengajar.programMatkul.prodi.nama,
                }
                : null,
        periode:
            first?.penugasanMengajar?.programMatkul?.periode != null
                ? {
                    id: first.penugasanMengajar.programMatkul.periode.id,
                    nama: first.penugasanMengajar.programMatkul.periode.nama,
                }
                : null,
    };

    return {
        type: 'PRODI',
        meta,
        hari,
        totalItem: items.length,
    };
}

module.exports = {
    getJadwalDosen,
    getJadwalKelas,
    getJadwalRuang,
    getJadwalProdi,
};
