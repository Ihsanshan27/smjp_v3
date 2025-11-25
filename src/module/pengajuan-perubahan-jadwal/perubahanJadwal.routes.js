const router = require('express').Router();
const controller = require('./perubahanJadwal.controller');
const validateDto = require('../../middlewares/validateDto');
const { auth, role } = require('../../middlewares/auth');
const {
    listPerubahanQueryDto,
    createPerubahanDto,
    approvePerubahanDto,
    rejectPerubahanDto,
} = require('./perubahanJadwal.dto');

// list & detail: semua user login boleh lihat (FE nanti filter sesuai role)
router.get('/', auth, validateDto(listPerubahanQueryDto), controller.list);
router.get('/:id', auth, controller.detail);
// create: TU_PRODI / DOSEN / TU_FAKULTAS / ADMIN
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI', 'DOSEN']), validateDto(createPerubahanDto), controller.create);
// approve/reject: ADMIN & TU_FAKULTAS aja
router.post('/:id/approve', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(approvePerubahanDto), controller.approve);
router.post('/:id/reject', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(rejectPerubahanDto), controller.reject);
// delete: hanya pembuat & status DIAJUKAN (dicek di service)
router.delete('/:id', auth, controller.remove);

module.exports = router;
