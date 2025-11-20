const router = require('express').Router();
const controller = require('./ruang.controller');
const validateDto = require('../../../middlewares/validateDto');
const { auth, role } = require('../../../middlewares/auth');
const {
    listRuangQueryDto,
    createRuangDto,
    updateRuangDto,
} = require('./ruang.dto');

// list/detail: semua user login
router.get('/', auth, validateDto(listRuangQueryDto), controller.list);
router.get('/:id', auth, controller.detail);

// create/update/delete: ADMIN & TU_FAKULTAS
router.post('/', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(createRuangDto), controller.create);
router.patch('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), validateDto(updateRuangDto), controller.update);
router.delete('/:id', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.remove);

// set aktif (bisa PATCH body { aktif: true/false })
router.patch('/:id/set-aktif', auth, role(['ADMIN', 'TU_FAKULTAS']), controller.setAktif);

module.exports = router;
