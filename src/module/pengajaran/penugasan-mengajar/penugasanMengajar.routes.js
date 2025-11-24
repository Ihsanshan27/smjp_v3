const router = require('express').Router();
const controller = require('./penugasanMengajar.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listPenugasanQueryDto,
    createPenugasanDto,
    updatePenugasanDto,
} = require('./penugasanMengajar.dto');

router.get('/', auth, validateDto(listPenugasanQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// penugasan mengajar
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(createPenugasanDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), validateDto(updatePenugasanDto), controller.update);
router.patch('/:id/set-siap', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.setSiap);
router.patch('/:id/set-draf', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.setDraf);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS', 'TU_PRODI']), controller.remove);

module.exports = router;
