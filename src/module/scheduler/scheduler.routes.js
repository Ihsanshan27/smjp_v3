const router = require('express').Router();
const controller = require('./scheduler.controller');
const validateDto = require('../../middlewares/validateDto');
const { auth, role } = require('../../middlewares/auth');
const {
    generateJadwalBodyDto,
    listBatchQueryDto,
    listJadwalQueryDto,
} = require('./scheduler.dto');

// generate jadwal GA
router.post('/generate', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(generateJadwalBodyDto), controller.generate);
// list batch
router.get('/batch', auth, validateDto(listBatchQueryDto), controller.listBatch);
// detail batch + full jadwal di dalamnya
router.get('/batch/:id', auth, controller.batchDetail);
// list jadwal with filter (per prodi/dosen/kelas/hari, dll)
router.get('/jadwal', auth, validateDto(listJadwalQueryDto), controller.listJadwal);
// set batch final
router.patch('/batch/:id/set-final', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.setBatchFinal);
// delete batch
router.delete('/batch/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.deleteBatch);

module.exports = router;
