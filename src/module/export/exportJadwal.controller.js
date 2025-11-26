const PDFDocument = require('pdfkit');
const prisma = require('../../config/prisma');
const { getJadwalForExport, exportJadwalCsvData } = require('./exportJadwal.service');

async function exportJadwalCsv(req, res, next) {
    try {
        const { query } = req.validated;
        const csv = await exportJadwalCsvData(query);

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="jadwal.csv"');
        return res.send(csv);
    } catch (err) {
        next(err);
    }
}

/* ======================================================
   UTIL TABLE
====================================================== */

const TABLE_HEADER_HEIGHT = 22;
const TABLE_ROW_FONTSIZE = 9;
const TABLE_HEADER_FONTSIZE = 10;

function drawTableHeader(doc, columns, y) {
    doc.fontSize(TABLE_HEADER_FONTSIZE)
        .font('Helvetica-Bold');

    let x = columns.startX;

    // background header
    doc.rect(columns.startX, y, columns.width, TABLE_HEADER_HEIGHT)
        .fill('#efefef')
        .stroke();

    // text
    columns.defs.forEach((col) => {
        doc.fill('#000')
            .text(col.label, x + 4, y + 5, {
                width: col.width - 8,
                align: col.align || 'left'
            });
        x += col.width;
    });

    return y + TABLE_HEADER_HEIGHT;
}

/* ======================================================
   PAGE HEADER
====================================================== */

function drawPageHeader(doc, title, filterLabel) {
    doc.font('Helvetica-Bold').fontSize(15).text(title, { align: 'center' });
    doc.moveDown(0.2);

    doc.font('Helvetica').fontSize(10).text(filterLabel, { align: 'center' });
    doc.moveDown(0.8);
}

/* ======================================================
   EXPORT PDF
====================================================== */

async function exportJadwalPdf(req, res, next) {
    try {
        const { query } = req.validated;
        const jadwalList = await getJadwalForExport(query);

        // ambil nama2 untuk judul
        const getName = async (model, id) => {
            if (!id) return null;
            const data = await prisma[model].findUnique({ where: { id } });
            return data?.nama || id;
        };

        const namaPeriode = await getName('periodeAkademik', query.periodeAkademikId);
        const namaFakultas = await getName('fakultas', query.fakultasId);
        const namaProdi = await getName('prodi', query.prodiId);
        const namaBatch = await getName('batchJadwal', query.batchId);

        const filterLabelParts = [];
        if (namaPeriode) filterLabelParts.push(`Periode: ${namaPeriode}`);
        if (namaFakultas) filterLabelParts.push(`Fakultas: ${namaFakultas}`);
        if (namaProdi) filterLabelParts.push(`Prodi: ${namaProdi}`);
        if (namaBatch) filterLabelParts.push(`Batch: ${namaBatch}`);

        const filterLabel = filterLabelParts.length
            ? filterLabelParts.join(' | ')
            : 'Semua jadwal';

        /* ===== START PDF ===== */
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="jadwal-perkuliahan.pdf"'
        );

        doc.pipe(res);

        /* ===== PAGE HEADER ===== */
        drawPageHeader(doc, 'JADWAL PERKULIAHAN', filterLabel);

        /* ===== TABLE SETUP ===== */
        const margin = doc.page.margins.left;
        const usableWidth = doc.page.width - margin * 2;

        const columns = {
            startX: margin,
            width: usableWidth,
            defs: [
                { key: 'hari', label: 'Hari', width: 50 },
                { key: 'jam', label: 'Jam', width: 60 },
                { key: 'ruang', label: 'Ruang', width: 85 },
                { key: 'prodi', label: 'Prodi', width: 85 },
                { key: 'kelas', label: 'Kelas', width: 55 },
                { key: 'matkul', label: 'Mata Kuliah', width: 125 },
                {
                    key: 'dosen',
                    label: 'Dosen',
                    width: usableWidth - (50 + 60 + 85 + 85 + 55 + 125)
                }
            ]
        };

        columns.endX = columns.startX + columns.width;

        let y = doc.y;
        y = drawTableHeader(doc, columns, y);

        const bottomLimit = doc.page.height - doc.page.margins.bottom - 40;

        doc.fontSize(TABLE_ROW_FONTSIZE).font('Helvetica');

        /* ===== NO DATA ===== */
        if (jadwalList.length === 0) {
            doc.moveDown(1).fontSize(10).text('Tidak ada data jadwal.', { align: 'center' });
            doc.end();
            return;
        }

        /* ===== DATA ROWS ===== */
        for (const j of jadwalList) {
            const hariNama = j.hari?.nama || '-';
            const jamMulai = j.slotWaktu?.jamMulai
                ? new Date(j.slotWaktu.jamMulai).toTimeString().slice(0, 5)
                : '-';
            const jamSelesai = j.slotWaktu?.jamSelesai
                ? new Date(j.slotWaktu.jamSelesai).toTimeString().slice(0, 5)
                : '-';

            const rowData = {
                hari: hariNama,
                jam: `${jamMulai} - ${jamSelesai}`,
                ruang: j.ruang ? `${j.ruang.kode}\n${j.ruang.nama}` : '-',
                prodi: j.penugasanMengajar?.programMatkul?.prodi?.nama || '-',
                kelas: j.penugasanMengajar?.kelompokKelas
                    ? `${j.penugasanMengajar.kelompokKelas.kode}\n(Angk. ${j.penugasanMengajar.kelompokKelas.angkatan})`
                    : '-',
                matkul:
                    `${j.penugasanMengajar?.programMatkul?.mataKuliah?.kode || '-'}\n` +
                    `${j.penugasanMengajar?.programMatkul?.mataKuliah?.nama || '-'}`,
                dosen:
                    j.penugasanMengajar?.dosen?.pengguna?.nama ||
                    j.penugasanMengajar?.dosen?.nama ||
                    '-'
            };

            /* ===== HITUNG HEIGHT ===== */
            let rowHeight = 0;
            columns.defs.forEach((col) => {
                const height = doc.heightOfString(rowData[col.key], {
                    width: col.width - 8
                });
                if (height > rowHeight) rowHeight = height;
            });
            rowHeight += 8;

            /* ===== PAGE BREAK ===== */
            if (y + rowHeight > bottomLimit) {
                doc.addPage();
                drawPageHeader(doc, 'JADWAL PERKULIAHAN', filterLabel);
                y = doc.y;
                y = drawTableHeader(doc, columns, y);
                doc.fontSize(TABLE_ROW_FONTSIZE).font('Helvetica');
            }

            /* ===== DRAW ROW ===== */
            let x = columns.startX;

            // border row
            doc.rect(columns.startX, y, columns.width, rowHeight).stroke();

            // text each cell
            columns.defs.forEach((col) => {
                doc.text(rowData[col.key], x + 4, y + 4, {
                    width: col.width - 8
                });
                x += col.width;
            });

            y += rowHeight;
        }

        doc.end();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    exportJadwalCsv,
    exportJadwalPdf,
};
