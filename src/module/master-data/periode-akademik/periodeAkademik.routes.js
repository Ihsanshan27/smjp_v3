const router = require('express').Router();
const controller = require('./periodeAkademik.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listPeriodeQueryDto,
    createPeriodeDto,
    updatePeriodeDto,
} = require('./periodeAkademik.dto');

// list/detail: semua user login
router.get('/', auth, validateDto(listPeriodeQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// modify + set aktif: ADMIN & TU_FAKULTAS
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(createPeriodeDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(updatePeriodeDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.remove);

router.patch('/:id/set-aktif', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.setAktif);

module.exports = router;
