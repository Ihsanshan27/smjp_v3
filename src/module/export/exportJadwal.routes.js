// src/modules/export/exportJadwal.routes.js
const router = require('express').Router();
const controller = require('./exportJadwal.controller');
const validateDto = require('../../middlewares/validateDto');
const { auth, role } = require('../../middlewares/auth');
const {
    exportJadwalCsvQueryDto,
    exportJadwalPdfQueryDto,
} = require('./exportJadwal.dto');

// CSV
router.get('/jadwal/csv', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(exportJadwalCsvQueryDto), controller.exportJadwalCsv);

// PDF
router.get('/jadwal/pdf', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(exportJadwalPdfQueryDto), controller.exportJadwalPdf);

module.exports = router;
