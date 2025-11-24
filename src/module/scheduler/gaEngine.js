/**
 * konversi penugasan menjadi list "sesi"
 * tiap sesi = satu kali pertemuan per minggu
 */
function expandPenugasanToSessions(penugasanList) {
    const sessions = [];
    for (const ta of penugasanList) {
        const count = ta.jumlahSesiPerMinggu || 1;
        for (let i = 0; i < count; i++) {
            sessions.push({
                penugasanId: ta.id,
                dosenId: ta.dosenId,
                kelompokKelasId: ta.kelompokKelasId,
                programMatkulId: ta.programMatkulId,
                butuhLab: ta.butuhLab,
                preferensiRuangJenis: ta.preferensiRuangJenis || null,
            });
        }
    }
    return sessions;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * buat 1 kromosom random
 */
function generateRandomChromosome({ sessions, hariList, slotList, ruangList }) {
    return sessions.map((s) => {
        // filter ruang kalau butuh lab
        let availableRooms = ruangList;
        if (s.butuhLab) {
            const labOnly = ruangList.filter((r) => r.jenis === 'LAB');
            if (labOnly.length > 0) {
                availableRooms = labOnly;
            }
        }

        const hari = randomChoice(hariList);
        const slot = randomChoice(slotList);
        const ruang = randomChoice(availableRooms);

        return {
            penugasanId: s.penugasanId,
            dosenId: s.dosenId,
            kelompokKelasId: s.kelompokKelasId,
            programMatkulId: s.programMatkulId,
            hariId: hari.id,
            slotWaktuId: slot.id,
            ruangId: ruang.id,
        };
    });
}

/**
 * build map preferensi dosen:
 * key: `${dosenId}-${hariId}-${slotId}`
 */
function buildPreferensiMap(preferensiList) {
    const map = new Map();
    for (const p of preferensiList) {
        const key = `${p.dosenId}-${p.hariId}-${p.slotWaktuId}`;
        map.set(key, {
            bolehMengajar: p.bolehMengajar,
            prioritas: p.prioritas,
        });
    }
    return map;
}

/**
 * hitung fitness: semakin besar semakin bagus
 */
function hitungFitness(kromosom, { sessions, preferensiMap }) {
    let penalty = 0;

    const dosenSlot = new Map(); // key: dosen-slot-day
    const kelasSlot = new Map(); // key: kelas-slot-day
    const ruangSlot = new Map(); // key: ruang-slot-day

    for (let i = 0; i < kromosom.length; i++) {
        const gene = kromosom[i];
        const session = sessions[i];

        const keyBase = `${gene.hariId}-${gene.slotWaktuId}`;
        const kDosen = `${session.dosenId}-${keyBase}`;
        const kKelas = `${session.kelompokKelasId}-${keyBase}`;
        const kRuang = `${gene.ruangId}-${keyBase}`;

        // bentrok dosen
        if (dosenSlot.has(kDosen)) penalty += 1000;
        else dosenSlot.set(kDosen, true);

        // bentrok kelas
        if (kelasSlot.has(kKelas)) penalty += 1000;
        else kelasSlot.set(kKelas, true);

        // bentrok ruang
        if (ruangSlot.has(kRuang)) penalty += 800;
        else ruangSlot.set(kRuang, true);

        // butuh lab tapi ruang bukan LAB
        if (session.butuhLab && gene.ruangJenis !== 'LAB') {
            penalty += 200;
        }

        // preferensi dosen (soft / hard)
        const prefKey = `${session.dosenId}-${gene.hariId}-${gene.slotWaktuId}`;
        if (preferensiMap && preferensiMap.has(prefKey)) {
            const pref = preferensiMap.get(prefKey);
            if (!pref.bolehMengajar) {
                penalty += 500; // dosen tidak mau ngajar di slot ini
            } else if (pref.prioritas != null) {
                // semakin kecil prioritas → lebih disukai
                penalty += pref.prioritas * 5;
            }
        } else {
            // tidak ada preferensi -> sedikit penalty biar GA cenderung ke slot yang ada preferensinya
            penalty += 10;
        }
    }

    // convert penalty -> fitness
    const fitness = 1 / (1 + penalty); // antara 0–1
    return { fitness, penalty };
}

/**
 * tournament selection
 */
function tournamentSelection(population, fitnessList, k = 3) {
    let bestIndex = null;
    for (let i = 0; i < k; i++) {
        const idx = Math.floor(Math.random() * population.length);
        if (bestIndex === null || fitnessList[idx] > fitnessList[bestIndex]) {
            bestIndex = idx;
        }
    }
    return population[bestIndex];
}

/**
 * 1-point crossover
 */
function crossover(parent1, parent2) {
    if (Math.random() > 0.9) {
        // 10%: no crossover
        return [parent1.slice(), parent2.slice()];
    }

    const length = parent1.length;
    const point = Math.floor(Math.random() * length);
    const child1 = parent1.slice(0, point).concat(parent2.slice(point));
    const child2 = parent2.slice(0, point).concat(parent1.slice(point));
    return [child1, child2];
}

/**
 * mutation: random re-assign slot/hari/ruang beberapa gene
 */
function mutate(chromosome, { hariList, slotList, ruangList }, mutationRate = 0.02) {
    const mutated = chromosome.map((gene) => {
        if (Math.random() < mutationRate) {
            const hari = randomChoice(hariList);
            const slot = randomChoice(slotList);
            const ruang = randomChoice(ruangList);
            return {
                ...gene,
                hariId: hari.id,
                slotWaktuId: slot.id,
                ruangId: ruang.id,
            };
        }
        return gene;
    });
    return mutated;
}

/**
 * jalankan GA full
 */
function jalankanGA({
    penugasanMengajarList,
    hariList,
    slotList,
    ruangList,
    preferensiList,
    ukuranPopulasi = 25,
    jumlahGenerasi = 50,
}) {
    const sessions = expandPenugasanToSessions(penugasanMengajarList);
    if (sessions.length === 0) {
        throw new Error('Tidak ada sesi pengajaran untuk dijadwalkan.');
    }

    const preferensiMap = buildPreferensiMap(preferensiList || []);

    // inisialisasi populasi
    let population = [];
    let fitnessList = [];

    for (let i = 0; i < ukuranPopulasi; i++) {
        const chrom = generateRandomChromosome({ sessions, hariList, slotList, ruangList });
        const { fitness } = hitungFitness(chrom, { sessions, preferensiMap });
        population.push(chrom);
        fitnessList.push(fitness);
    }

    let bestChrom = population[0];
    let bestFitness = fitnessList[0];

    for (let gen = 0; gen < jumlahGenerasi; gen++) {
        const newPopulation = [];
        const newFitnessList = [];

        while (newPopulation.length < ukuranPopulasi) {
            const p1 = tournamentSelection(population, fitnessList);
            const p2 = tournamentSelection(population, fitnessList);
            const [c1, c2] = crossover(p1, p2);

            const m1 = mutate(c1, { hariList, slotList, ruangList });
            const m2 = mutate(c2, { hariList, slotList, ruangList });

            const { fitness: f1 } = hitungFitness(m1, { sessions, preferensiMap });
            const { fitness: f2 } = hitungFitness(m2, { sessions, preferensiMap });

            newPopulation.push(m1);
            newFitnessList.push(f1);

            if (newPopulation.length < ukuranPopulasi) {
                newPopulation.push(m2);
                newFitnessList.push(f2);
            }
        }

        population = newPopulation;
        fitnessList = newFitnessList;

        // update best
        for (let i = 0; i < population.length; i++) {
            if (fitnessList[i] > bestFitness) {
                bestFitness = fitnessList[i];
                bestChrom = population[i];
            }
        }
    }

    // attach jenis ruang ke gene untuk perhitungan penalty (butuhLab)
    const ruangById = new Map(ruangList.map((r) => [r.id, r]));
    const bestChromWithMeta = bestChrom.map((g) => ({
        ...g,
        ruangJenis: ruangById.get(g.ruangId)?.jenis || null,
    }));
    const { penalty } = hitungFitness(bestChromWithMeta, { sessions, preferensiMap });

    return {
        kromosomTerbaik: bestChromWithMeta,
        fitnessTerbaik: bestFitness,
        penaltyTerbaik: penalty,
        totalGenerasi: jumlahGenerasi,
        sessions,
    };
}

module.exports = {
    jalankanGA,
};
